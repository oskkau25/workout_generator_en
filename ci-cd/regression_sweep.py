#!/usr/bin/env python3
"""
v2.2 regression sweep runner.

Covers the first release-checklist point with a focused matrix:
- Generator modes: standard, circuit, tabata, pyramid
- Timer modes: standard, tabata, hiit, custom
- Auth flow: register, login, reset password, logout, session persistence
"""

from __future__ import annotations

import argparse
import json
import socket
import threading
import time
from dataclasses import dataclass
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict, List

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_ROOT = PROJECT_ROOT / "src"
REPORT_PATH = PROJECT_ROOT / "reports" / "test_results" / "regression_sweep_report.json"


def _is_port_open(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.4)
        return sock.connect_ex((host, port)) == 0


def _first_free_port(host: str, start: int) -> int:
    port = start
    while _is_port_open(host, port):
        port += 1
    return port


@dataclass
class LocalServer:
    host: str = "127.0.0.1"
    start_port: int = 8001

    def __post_init__(self) -> None:
        self.httpd: ThreadingHTTPServer | None = None
        self.thread: threading.Thread | None = None
        self.port = _first_free_port(self.host, self.start_port)

    def start(self) -> str:
        handler = partial(SimpleHTTPRequestHandler, directory=str(SRC_ROOT))
        self.httpd = ThreadingHTTPServer((self.host, self.port), handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        time.sleep(0.4)
        return f"http://{self.host}:{self.port}/index.html"

    def stop(self) -> None:
        if self.httpd is not None:
            self.httpd.shutdown()
            self.httpd.server_close()
        if self.thread is not None:
            self.thread.join(timeout=2)


def _wait_for_app(page: Any) -> None:
    page.goto(page.url or "about:blank")
    page.wait_for_selector("#workout-form", timeout=15000)
    page.wait_for_function("() => !!window.userAccount", timeout=15000)


def _clear_app_storage(page: Any) -> None:
    page.evaluate(
        """() => {
            localStorage.removeItem('fitflow_current_user');
            localStorage.removeItem('fitflow_users');
        }"""
    )


def _generate_workout(
    page: Any,
    duration_id: str,
    equipment_ids: List[str],
    fitness_level: str,
    pattern: str,
) -> Dict[str, Any]:
    payload = {
        "duration_id": duration_id,
        "equipment_ids": equipment_ids,
        "fitness_level": fitness_level,
        "pattern": pattern,
    }
    return page.evaluate(
        """({ duration_id, equipment_ids, fitness_level, pattern }) => {
            const form = document.getElementById('workout-form');
            if (!form) return { ok: false, error: 'workout-form missing' };

            form.reset();

            const durationInput = document.getElementById(duration_id);
            if (!durationInput) return { ok: false, error: `duration input ${duration_id} missing` };
            durationInput.checked = true;
            durationInput.dispatchEvent(new Event('change', { bubbles: true }));

            const allEquipment = document.querySelectorAll('input[name="equipment"]');
            allEquipment.forEach(el => { el.checked = false; });
            for (const eqId of equipment_ids) {
                const eq = document.getElementById(eqId);
                if (eq) {
                    eq.checked = true;
                    eq.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            const level = document.getElementById('fitness-level');
            if (level) {
                level.value = fitness_level;
                level.dispatchEvent(new Event('change', { bubbles: true }));
            }

            const patternInput = document.querySelector(`input[name="training-pattern"][value="${pattern}"]`);
            if (patternInput) {
                patternInput.checked = true;
                patternInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

            return { ok: true };
        }""",
        payload,
    )


def run_generator_matrix(page: Any) -> Dict[str, Any]:
    checks: Dict[str, Any] = {}
    modes = [
        ("standard", "duration-30", ["eq-bodyweight"], "Intermediate"),
        ("circuit", "duration-45", ["eq-dumbbells"], "Advanced"),
        ("tabata", "duration-15", ["eq-kettlebell"], "Beginner"),
        ("pyramid", "duration-60", ["eq-bodyweight", "eq-dumbbells"], "Advanced"),
    ]

    for mode, duration_id, equipment_ids, level in modes:
        start = _generate_workout(page, duration_id, equipment_ids, level, mode)
        time.sleep(1.2)
        details = page.evaluate(
            """(mode) => {
                const data = window.currentWorkoutData || window.workoutData || null;
                const generated = !!data && Array.isArray(data.sequence) && data.sequence.length > 0;
                return {
                    mode,
                    generated,
                    actualPattern: data?.trainingPattern || null,
                    sequenceLength: data?.sequence?.length || 0,
                    workTime: data?.workTime || null,
                    restTime: data?.restTime || null
                };
            }""",
            mode,
        )
        checks[mode] = {"setup": start, "result": details}

    invalid = page.evaluate(
        """() => {
            const form = document.getElementById('workout-form');
            if (!form) return { blocked: false, reason: 'form missing' };

            const before = JSON.stringify(window.currentWorkoutData || null);
            form.reset();

            document.querySelectorAll('input[name="duration"]').forEach(el => { el.checked = false; });
            document.querySelectorAll('input[name="equipment"]').forEach(el => { el.checked = false; });

            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

            const after = JSON.stringify(window.currentWorkoutData || null);
            const unchanged = before === after;
            const htmlValid = form.checkValidity();

            return {
                blocked: unchanged,
                htmlValid,
                reason: unchanged ? 'workout data unchanged on invalid submit' : 'workout changed'
            };
        }"""
    )
    checks["invalid_input"] = invalid

    edge = _generate_workout(
        page,
        "duration-60",
        ["eq-bodyweight", "eq-dumbbells", "eq-kettlebell", "eq-trx", "eq-machine"],
        "Advanced",
        "pyramid",
    )
    time.sleep(1.2)
    edge_result = page.evaluate(
        """() => {
            const data = window.currentWorkoutData || null;
            return {
                generated: !!data && Array.isArray(data.sequence) && data.sequence.length > 0,
                sequenceLength: data?.sequence?.length || 0,
                duration: data?.duration || null,
                pattern: data?.trainingPattern || null
            };
        }"""
    )
    checks["edge_case"] = {"setup": edge, "result": edge_result}

    all_modes_ok = all(
        checks[m]["result"]["generated"] and checks[m]["result"]["actualPattern"] == m
        for m in ("standard", "circuit", "tabata", "pyramid")
    )
    return {
        "status": "PASSED" if all_modes_ok and checks["edge_case"]["result"]["generated"] else "WARNING",
        "checks": checks,
    }


def run_timer_matrix(page: Any) -> Dict[str, Any]:
    start_setup = _generate_workout(
        page, "duration-30", ["eq-bodyweight"], "Intermediate", "standard"
    )
    time.sleep(1.1)
    page.click('button[onclick="startWorkout()"]')

    try:
        page.wait_for_selector("#timer-mode-select", timeout=12000)
    except PlaywrightTimeoutError:
        return {
            "status": "FAILED",
            "error": "timer mode selector did not appear",
            "setup": start_setup,
        }

    baseline = page.evaluate(
        """() => ({
            workTime: window.workoutState?.workTime || null,
            restTime: window.workoutState?.restTime || null
        })"""
    )

    results: Dict[str, Any] = {}
    mode_expectations: Dict[str, Dict[str, int]] = {
        "standard": {
            "workTime": int(baseline.get("workTime") or 45),
            "restTime": int(baseline.get("restTime") or 15),
        },
        "tabata": {"workTime": 20, "restTime": 10},
        "hiit": {"workTime": 30, "restTime": 15},
        "custom": {"workTime": 55, "restTime": 25},
    }

    for mode in ("standard", "tabata", "hiit", "custom"):
        page.select_option("#timer-mode-select", mode)
        if mode == "custom":
            page.evaluate(
                """({ workTime, restTime }) => {
                    const work = document.getElementById('custom-work-time');
                    const rest = document.getElementById('custom-rest-time');
                    if (work) {
                        work.value = String(workTime);
                        work.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    if (rest) {
                        rest.value = String(restTime);
                        rest.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }""",
                {
                    "workTime": mode_expectations["custom"]["workTime"],
                    "restTime": mode_expectations["custom"]["restTime"],
                },
            )
        time.sleep(0.25)
        result = page.evaluate(
            """(mode) => {
                const s = window.workoutState || {};
                const d = window.currentWorkoutData || {};
                return {
                    mode,
                    state: {
                        workTime: s.workTime ?? null,
                        restTime: s.restTime ?? null,
                        phase: s.phase ?? null,
                        remainingSeconds: s.remainingSeconds ?? null
                    },
                    workoutData: {
                        workTime: d.workTime ?? null,
                        restTime: d.restTime ?? null
                    }
                };
            }""",
            mode,
        )
        expected = mode_expectations[mode]
        matches = (
            result["state"]["workTime"] == expected["workTime"]
            and result["state"]["restTime"] == expected["restTime"]
            and result["workoutData"]["workTime"] == expected["workTime"]
            and result["workoutData"]["restTime"] == expected["restTime"]
        )
        result["matches_expected"] = matches
        results[mode] = result

    passed = all(results[m]["matches_expected"] for m in results)
    return {"status": "PASSED" if passed else "WARNING", "checks": results, "setup": start_setup}


def run_auth_matrix(page: Any) -> Dict[str, Any]:
    _clear_app_storage(page)
    username = f"regression_user_{int(time.time())}"
    password = "Pass1234!"
    new_password = "NewPass5678!"

    checks: Dict[str, Any] = {}

    checks["register"] = page.evaluate(
        """async ({ username, password }) => {
            return await window.userAccount.register(username, password, {
                name: 'Regression User',
                securityQuestion: 'pet_name',
                securityAnswer: 'fluffy',
                experience: 'Beginner'
            });
        }""",
        {"username": username, "password": password},
    )

    page.evaluate("() => window.userAccount.logout()")
    checks["login_original_password"] = page.evaluate(
        """async ({ username, password }) => {
            return await window.userAccount.login(username, password);
        }""",
        {"username": username, "password": password},
    )

    checks["session_persists_after_reload"] = page.evaluate(
        """() => ({ isLoggedIn: window.userAccount.isLoggedIn, user: window.userAccount.currentUser?.username || null })"""
    )
    page.reload(wait_until="networkidle")
    page.wait_for_function("() => !!window.userAccount")
    checks["session_after_reload"] = page.evaluate(
        """() => ({ isLoggedIn: window.userAccount.isLoggedIn, user: window.userAccount.currentUser?.username || null })"""
    )

    checks["reset_password"] = page.evaluate(
        """async ({ username, newPassword }) => {
            return await window.userAccount.resetPassword(
                username,
                'pet_name',
                'fluffy',
                newPassword
            );
        }""",
        {"username": username, "newPassword": new_password},
    )

    page.evaluate("() => window.userAccount.logout()")
    checks["login_new_password"] = page.evaluate(
        """async ({ username, password }) => {
            return await window.userAccount.login(username, password);
        }""",
        {"username": username, "password": new_password},
    )
    page.evaluate("() => window.userAccount.logout()")
    checks["login_old_password_after_reset"] = page.evaluate(
        """async ({ username, password }) => {
            return await window.userAccount.login(username, password);
        }""",
        {"username": username, "password": password},
    )

    page.evaluate("() => window.userAccount.logout()")
    page.reload(wait_until="networkidle")
    page.wait_for_function("() => !!window.userAccount")
    checks["logged_out_after_reload"] = page.evaluate(
        """() => ({ isLoggedIn: window.userAccount.isLoggedIn, user: window.userAccount.currentUser || null })"""
    )

    passed = (
        checks["register"].get("success") is True
        and checks["login_original_password"].get("success") is True
        and checks["session_after_reload"].get("isLoggedIn") is True
        and checks["reset_password"].get("success") is True
        and checks["login_new_password"].get("success") is True
        and checks["login_old_password_after_reset"].get("success") is False
        and checks["logged_out_after_reload"].get("isLoggedIn") is False
    )
    return {"status": "PASSED" if passed else "WARNING", "checks": checks}


def run_regression_sweep(headless: bool = True) -> Dict[str, Any]:
    server = LocalServer()
    started = time.time()
    base_url = server.start()

    report: Dict[str, Any] = {
        "timestamp": time.time(),
        "base_url": base_url,
        "status": "FAILED",
        "execution_seconds": 0.0,
        "sections": {},
        "blockers": [],
    }

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=headless)
            page = browser.new_page()
            page.goto(base_url, wait_until="networkidle")
            page.wait_for_selector("#workout-form", timeout=15000)
            page.wait_for_function("() => !!window.userAccount", timeout=15000)

            generator = run_generator_matrix(page)
            timer = run_timer_matrix(page)
            auth = run_auth_matrix(page)

            report["sections"]["generator_matrix"] = generator
            report["sections"]["timer_matrix"] = timer
            report["sections"]["auth_matrix"] = auth

            for name, section in report["sections"].items():
                if section.get("status") != "PASSED":
                    report["blockers"].append(
                        {
                            "section": name,
                            "status": section.get("status"),
                        }
                    )

            report["status"] = "PASSED" if not report["blockers"] else "WARNING"
            browser.close()
    except Exception as exc:
        report["status"] = "FAILED"
        report["error"] = str(exc)
    finally:
        report["execution_seconds"] = round(time.time() - started, 2)
        server.stop()

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Run v2.2 regression sweep")
    parser.add_argument(
        "--visible",
        action="store_true",
        help="Run browser in visible mode",
    )
    args = parser.parse_args()

    report = run_regression_sweep(headless=not args.visible)
    print(json.dumps(report, indent=2))

    if report["status"] == "PASSED":
        raise SystemExit(0)
    if report["status"] == "WARNING":
        raise SystemExit(1)
    raise SystemExit(2)


if __name__ == "__main__":
    main()
