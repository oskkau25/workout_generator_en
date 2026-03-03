"""Deterministic E2E smoke runner for release gates.

This smoke suite intentionally checks only critical, stable paths:
- app loads
- form controls exist
- minimal workout can be generated

It avoids broad feature crawling to reduce flaky results.
"""

from __future__ import annotations

import json
import logging
import socket
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Callable, Dict, Optional, Tuple
from urllib.parse import unquote, urlsplit


def _is_port_open(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0


def _retry_test(test_func: Callable, max_retries: int = 3, delay: float = 1.0) -> Any:
    """Retry a test function with exponential backoff."""
    for attempt in range(max_retries):
        try:
            return test_func()
        except Exception as exc:
            if attempt == max_retries - 1:
                logging.warning(f"Test failed after {max_retries} attempts: {exc}")
                raise
            logging.info(f"Test attempt {attempt + 1} failed, retrying in {delay}s: {exc}")
            time.sleep(delay)
            delay *= 1.5
    return None


class _SrcHandler(SimpleHTTPRequestHandler):
    """Serve files from src/ while ignoring query and fragment."""

    def translate_path(self, path: str) -> str:
        root = Path(__file__).resolve().parent.parent / "src"
        clean_path = unquote(urlsplit(path).path).lstrip("/")
        full = (root / clean_path).resolve()
        if full.is_dir():
            index = full / "index.html"
            if index.exists():
                return str(index)
        return str(full)


def _find_open_port(host: str, starting_port: int) -> int:
    port = starting_port
    while _is_port_open(host, port):
        port += 1
    return port


def _is_http_service(host: str, port: int) -> bool:
    """Best-effort check that a port serves HTTP responses."""
    try:
        with socket.create_connection((host, port), timeout=0.5) as conn:
            conn.sendall(b"GET / HTTP/1.0\r\nHost: localhost\r\n\r\n")
            chunk = conn.recv(16)
            return chunk.startswith(b"HTTP/")
    except Exception:
        return False


def _start_local_server() -> Tuple[Optional[ThreadingHTTPServer], int]:
    host, default_port = "127.0.0.1", 8001

    if _is_port_open(host, default_port):
        if _is_http_service(host, default_port):
            logging.info(f"Reusing existing HTTP server on {host}:{default_port}")
            return None, default_port
        logging.warning(
            f"Port {default_port} is in use by non-HTTP service; selecting fallback port."
        )
        port = _find_open_port(host, default_port + 1)
    else:
        port = default_port

    server = ThreadingHTTPServer((host, port), _SrcHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    time.sleep(0.4)
    logging.info(f"Started smoke server on {host}:{port}")
    return server, port


def _configure_form_and_submit(page: Any) -> bool:
    """Set minimal valid form values and submit once."""
    return bool(
        page.evaluate(
            """
            () => {
                const form = document.getElementById('workout-form');
                if (!form) return false;

                // Duration: keep current checked or choose first option.
                const durationChecked = document.querySelector('input[name="duration"]:checked');
                if (!durationChecked) {
                    const durationFirst = document.querySelector('input[name="duration"]');
                    if (!durationFirst) return false;
                    durationFirst.checked = true;
                    durationFirst.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Equipment: keep current checked or choose first option.
                const equipmentChecked = document.querySelector('input[name="equipment"]:checked');
                if (!equipmentChecked) {
                    const equipmentFirst = document.querySelector('input[name="equipment"]');
                    if (!equipmentFirst) return false;
                    equipmentFirst.checked = true;
                    equipmentFirst.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Fitness level: set first non-empty option if select exists.
                const fitnessLevel = document.getElementById('fitness-level');
                if (fitnessLevel && fitnessLevel.options && fitnessLevel.options.length > 0) {
                    if (!fitnessLevel.value) {
                        for (const opt of fitnessLevel.options) {
                            if (opt.value) {
                                fitnessLevel.value = opt.value;
                                break;
                            }
                        }
                    }
                    fitnessLevel.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Training pattern: keep checked or choose first option.
                const patternChecked = document.querySelector('input[name="training-pattern"]:checked');
                if (!patternChecked) {
                    const patternFirst = document.querySelector('input[name="training-pattern"]');
                    if (!patternFirst) return false;
                    patternFirst.checked = true;
                    patternFirst.dispatchEvent(new Event('change', { bubbles: true }));
                }

                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                return true;
            }
            """
        )
    )


def _workout_generated(page: Any) -> bool:
    return bool(
        page.evaluate(
            """
            () => {
                const data = window.currentWorkoutData || window.workoutData || null;
                const hasSequence = !!data && Array.isArray(data.sequence) && data.sequence.length > 0;

                const section = document.querySelector('#workout-section');
                const overview = document.querySelector('#workout-overview');
                const uiVisible = (
                    !!section && !section.classList.contains('hidden')
                ) || (
                    !!overview && !overview.classList.contains('hidden')
                );

                return hasSequence || uiVisible;
            }
            """
        )
    )


def run_dynamic_smoke() -> Dict[str, Any]:
    """Run deterministic E2E smoke checks."""
    try:
        from playwright.sync_api import sync_playwright  # type: ignore
    except Exception as exc:
        return {
            "status": "FAILED",
            "details": f"Playwright unavailable for required smoke test: {exc}",
            "checks": {},
        }

    local_server, port = _start_local_server()
    url = f"http://127.0.0.1:{port}/"
    checks: Dict[str, bool] = {}
    errors = []

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
            )
            page = browser.new_page()
            page.set_default_timeout(15000)

            page.goto(url, wait_until="networkidle")
            page.wait_for_selector("#workout-form")

            checks["app_loaded"] = True
            checks["has_workout_form"] = bool(page.query_selector("#workout-form"))
            checks["has_generate_button"] = bool(page.query_selector("#generate-btn"))
            checks["has_fitness_level"] = bool(page.query_selector("#fitness-level"))

            def _submit_and_verify() -> bool:
                if not _configure_form_and_submit(page):
                    raise RuntimeError("could not configure minimal valid form input")
                page.wait_for_timeout(700)
                if not _workout_generated(page):
                    raise AssertionError("workout was not generated after submit")
                return True

            try:
                checks["workout_generation"] = bool(
                    _retry_test(_submit_and_verify, max_retries=2, delay=0.4)
                )
            except Exception as exc:
                checks["workout_generation"] = False
                errors.append(str(exc))

            browser.close()
    except Exception as exc:
        errors.append(f"E2E smoke runtime error: {exc}")
        checks.setdefault("app_loaded", False)
        checks.setdefault("has_workout_form", False)
        checks.setdefault("has_generate_button", False)
        checks.setdefault("has_fitness_level", False)
        checks.setdefault("workout_generation", False)
    finally:
        if local_server is not None:
            local_server.shutdown()
            local_server.server_close()

    required_checks = [
        "app_loaded",
        "has_workout_form",
        "has_generate_button",
        "has_fitness_level",
        "workout_generation",
    ]
    passed = all(checks.get(name, False) for name in required_checks)

    return {
        "status": "PASSED" if passed else "FAILED",
        "checks": checks,
        "required_checks": required_checks,
        "url": url,
        "errors": errors,
    }


if __name__ == "__main__":
    print(json.dumps(run_dynamic_smoke(), indent=2))
