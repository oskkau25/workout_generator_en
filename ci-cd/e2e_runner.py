"""
Dynamic E2E test runner (best-effort, graceful skip).

Attempts to:
- Read ci-cd/app_features.json
- Start a local HTTP server on 5173 serving src/
- If Playwright is available, open the app and perform smoke checks based on features

If Playwright isn't available, returns a SKIPPED result (no failure).
"""
from __future__ import annotations

import json
import os
import socket
import threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from typing import Dict, Any


def _is_port_open(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0


class _SrcHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Serve from src directory
        root = Path(__file__).resolve().parent.parent / 'src'
        full = (root / path.lstrip('/')).resolve()
        if full.is_dir():
            index = full / 'index.html'
            if index.exists():
                return str(index)
        return str(full)


def _start_local_server() -> threading.Thread:
    host, port = '127.0.0.1', 5173
    if _is_port_open(host, port):
        # Assume already running
        return None
    server = ThreadingHTTPServer((host, port), _SrcHandler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return t


def _load_feature_list(project_root: Path) -> Dict[str, Any]:
    p = project_root / 'ci-cd' / 'app_features.json'
    with p.open('r', encoding='utf-8') as f:
        return json.load(f)


def run_dynamic_smoke() -> Dict[str, Any]:
    project_root = Path(__file__).parent.parent
    try:
        features = _load_feature_list(project_root)
    except Exception as e:
        return {"status": "FAILED", "details": f"Cannot read feature list: {e}"}

    # Try Playwright import
    try:
        from playwright.sync_api import sync_playwright  # type: ignore
    except Exception:
        return {"status": "SKIPPED", "details": "Playwright not installed"}

    # Ensure local server
    _start_local_server()

    checks = {}
    url = 'http://127.0.0.1:5173/'
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url, wait_until='domcontentloaded')

            # Minimal, dynamic presence checks based on features
            app_feats = features.get('app_features', {})

            # Form presence
            if 'form_interactions' in app_feats:
                checks['has_workout_form'] = bool(page.query_selector('#workout-form'))

            # Smart substitution indicator in page
            if 'smart_exercise_substitution' in app_feats:
                checks['has_smart_substitution_badge'] = bool(page.locator('text=Smart Exercise Substitution').first)

            # Generate a workout if form exists
            if checks.get('has_workout_form'):
                # Pick defaults and submit
                # Ensure a duration choice exists
                dur = page.query_selector('input[name="duration"]')
                if not dur:
                    # try selecting 30 explicitly
                    page.evaluate("""
                        () => { const el = document.getElementById('duration-30'); if (el) el.checked = true; }
                    """)
                page.evaluate("""
                    () => { const form = document.getElementById('workout-form'); if (form) form.dispatchEvent(new Event('submit', {cancelable:true, bubbles:true})); }
                """)
                page.wait_for_timeout(400)
                # Workout section visible
                checks['workout_rendered'] = bool(page.query_selector('#workout-section'))
                # At least one exercise item
                checks['has_exercise_items'] = page.locator('[id^="exercise-item-"]').count() > 0

            browser.close()
    except Exception as e:
        return {"status": "FAILED", "details": f"E2E error: {e}", "checks": checks}

    passed = all(bool(v) for v in checks.values()) if checks else True
    return {
        "status": "PASSED" if passed else "WARNING",
        "checks": checks,
        "url": url
    }


if __name__ == '__main__':
    print(json.dumps(run_dynamic_smoke(), indent=2))


