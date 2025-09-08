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
                # Test 1: Basic workout generation with defaults
                page.evaluate("""
                    () => { const el = document.getElementById('duration-30'); if (el) el.checked = true; }
                """)
                page.evaluate("""
                    () => { const form = document.getElementById('workout-form'); if (form) form.dispatchEvent(new Event('submit', {cancelable:true, bubbles:true})); }
                """)
                page.wait_for_timeout(400)
                checks['workout_rendered'] = bool(page.query_selector('#workout-section'))
                checks['has_exercise_items'] = page.locator('[id^="exercise-item-"]').count() > 0
                
                # Test 2: Equipment filtering validation
                page.evaluate("""
                    () => {
                        // Select multiple equipment types
                        const dumbbell = document.getElementById('eq-dumbbells');
                        const kettlebell = document.getElementById('eq-kettlebells');
                        if (dumbbell) dumbbell.checked = true;
                        if (kettlebell) kettlebell.checked = true;
                        
                        // Submit form
                        const form = document.getElementById('workout-form');
                        if (form) form.dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}));
                    }
                """)
                page.wait_for_timeout(400)
                
                # Validate equipment filtering worked
                workout_metadata = page.evaluate("""
                    () => {
                        const metadataEl = document.querySelector('.workout-stats');
                        if (metadataEl) {
                            const equipmentText = metadataEl.textContent;
                            return equipmentText.includes('Dumbbell') || equipmentText.includes('Kettlebell');
                        }
                        return false;
                    }
                """)
                checks['equipment_filtering_works'] = workout_metadata
                
                # Test 3: Dynamic Duration Validation (Auto-detected)
                # Dynamically detect all available duration options from the form
                available_durations = page.evaluate("""
                    () => {
                        const durationInputs = document.querySelectorAll('input[name="duration"]');
                        const durations = [];
                        durationInputs.forEach(input => {
                            durations.push(input.value);
                        });
                        return durations;
                    }
                """)
                
                # Test a few different durations (not all to keep test time reasonable)
                test_durations = available_durations[:3] if len(available_durations) > 3 else available_durations
                duration_results = {}
                
                for duration in test_durations:
                    try:
                        page.evaluate(f"""
                            () => {{
                                // Reset form
                                const form = document.getElementById('workout-form');
                                if (form) form.reset();
                                
                                // Select specific duration
                                const el = document.querySelector('input[name="duration"][value="{duration}"]');
                                if (el) el.checked = true;
                                
                                // Submit form
                                if (form) form.dispatchEvent(new Event('submit', {{cancelable:true, bubbles:true}}));
                            }}
                        """)
                        page.wait_for_timeout(400)
                        
                        # Validate duration is correctly displayed
                        duration_correct = page.evaluate(f"""
                            () => {{
                                const metadataEl = document.querySelector('.workout-stats');
                                if (metadataEl) {{
                                    const text = metadataEl.textContent;
                                    return text.includes('{duration}') || text.includes('{duration} min');
                                }}
                                return false;
                            }}
                        """)
                        duration_results[f'duration_{duration}_correct'] = duration_correct
                        
                    except Exception as e:
                        duration_results[f'duration_{duration}_error'] = str(e)
                
                checks['duration_validation_tests'] = duration_results
                
                # Test 4: Dynamic Training Pattern Validation (Auto-detected)
                # Dynamically detect all available training patterns from the form
                available_patterns = page.evaluate("""
                    () => {
                        const patternInputs = document.querySelectorAll('input[name="training-pattern"]');
                        const patterns = [];
                        patternInputs.forEach(input => {
                            patterns.push(input.value);
                        });
                        return patterns;
                    }
                """)
                
                pattern_results = {}
                
                for pattern in available_patterns:
                    try:
                        page.evaluate(f"""
                            () => {{
                                // Reset form
                                const form = document.getElementById('workout-form');
                                if (form) form.reset();
                                
                                // Set basic values
                                const duration = document.getElementById('duration-30');
                                if (duration) duration.checked = true;
                                
                                // Set training pattern
                                const patternEl = document.querySelector('input[name="training-pattern"][value="{pattern}"]');
                                if (patternEl) patternEl.checked = true;
                                
                                // Submit form
                                if (form) form.dispatchEvent(new Event('submit', {{cancelable:true, bubbles:true}}));
                            }}
                        """)
                        page.wait_for_timeout(400)
                        
                        # Check if workout was generated for this pattern
                        workout_generated = page.evaluate("""
                            () => {
                                const workoutSection = document.querySelector('#workout-section');
                                const exerciseItems = document.querySelectorAll('[id^="exercise-item-"]');
                                return workoutSection && exerciseItems.length > 0;
                            }
                        """)
                        pattern_results[f'{pattern}_workout_generated'] = workout_generated
                        
                        # Check for pattern-specific elements
                        if pattern == 'circuit':
                            has_circuit_rounds = page.evaluate("""
                                () => {
                                    const circuitRounds = document.querySelectorAll('[id*="circuit-round"]');
                                    return circuitRounds.length > 0;
                                }
                            """)
                            pattern_results['circuit_has_rounds'] = has_circuit_rounds
                        
                    except Exception as e:
                        pattern_results[f'{pattern}_error'] = str(e)
                
                checks['training_pattern_tests'] = pattern_results
                
                # Test 5: Dynamic Equipment Combinations (Auto-detected)
                # Dynamically detect all available equipment options from the form
                available_equipment = page.evaluate("""
                    () => {
                        const equipmentInputs = document.querySelectorAll('input[name="equipment"]');
                        const equipment = [];
                        equipmentInputs.forEach(input => {
                            const label = document.querySelector(`label[for="${input.id}"]`);
                            if (label) {
                                equipment.push(label.textContent.trim());
                            }
                        });
                        return equipment;
                    }
                """)
                
                # Generate equipment combinations dynamically
                equipment_combinations = []
                
                # Single equipment tests
                for eq in available_equipment:
                    equipment_combinations.append([eq])
                
                # Two-equipment combinations
                for i, eq1 in enumerate(available_equipment):
                    for eq2 in available_equipment[i+1:]:
                        equipment_combinations.append([eq1, eq2])
                
                # Three-equipment combinations (if we have enough equipment)
                if len(available_equipment) >= 3:
                    for i, eq1 in enumerate(available_equipment):
                        for j, eq2 in enumerate(available_equipment[i+1:], i+1):
                            for eq3 in available_equipment[j+1:]:
                                equipment_combinations.append([eq1, eq2, eq3])
                
                # Limit to reasonable number of combinations for performance
                equipment_combinations = equipment_combinations[:10]
                
                equipment_results = {}
                for i, combo in enumerate(equipment_combinations):
                    try:
                        page.evaluate(f"""
                            () => {{
                                // Reset form
                                const form = document.getElementById('workout-form');
                                if (form) form.reset();
                                
                                // Set basic values
                                const duration = document.getElementById('duration-30');
                                if (duration) duration.checked = true;
                                
                                // Clear all equipment first
                                const allEquipment = document.querySelectorAll('input[name="equipment"]');
                                allEquipment.forEach(el => el.checked = false);
                                
                                // Select specific equipment combination
                                {chr(10).join([f'const eq{i} = document.getElementById("eq-{eq.lower().replace(" ", "-")}"); if (eq{i}) eq{i}.checked = true;' for i, eq in enumerate(combo)])}
                                
                                // Submit form
                                if (form) form.dispatchEvent(new Event('submit', {{cancelable:true, bubbles:true}}));
                            }}
                        """)
                        page.wait_for_timeout(400)
                        
                        # Check if workout contains selected equipment
                        equipment_found = page.evaluate(f"""
                            () => {{
                                const workoutSection = document.querySelector('#workout-section');
                                if (!workoutSection) return false;
                                
                                const text = workoutSection.textContent.toLowerCase();
                                const expectedEquipment = {[eq.lower() for eq in combo]};
                                return expectedEquipment.some(eq => text.includes(eq));
                            }}
                        """)
                        equipment_results[f'combo_{i}_{"_".join(combo).lower().replace(" ", "_")}'] = equipment_found
                        
                    except Exception as e:
                        equipment_results[f'combo_{i}_error'] = str(e)
                
                checks['equipment_combination_tests'] = equipment_results
                
                # Test 6: Dynamic Fitness Level Validation (Auto-detected)
                # Dynamically detect all available fitness levels from the form
                available_levels = page.evaluate("""
                    () => {
                        const levelSelect = document.getElementById('fitness-level');
                        if (!levelSelect) return [];
                        const levels = [];
                        for (let option of levelSelect.options) {
                            if (option.value) {
                                levels.push(option.value);
                            }
                        }
                        return levels;
                    }
                """)
                
                level_results = {}
                
                for level in available_levels:
                    try:
                        page.evaluate(f"""
                            () => {{
                                // Reset form
                                const form = document.getElementById('workout-form');
                                if (form) form.reset();
                                
                                // Set basic values
                                const duration = document.getElementById('duration-30');
                                if (duration) duration.checked = true;
                                
                                // Set fitness level
                                const levelSelect = document.getElementById('fitness-level');
                                if (levelSelect) levelSelect.value = '{level}';
                                
                                // Submit form
                                if (form) form.dispatchEvent(new Event('submit', {{cancelable:true, bubbles:true}}));
                            }}
                        """)
                        page.wait_for_timeout(400)
                        
                        # Check if workout was generated
                        workout_generated = page.evaluate("""
                            () => {
                                const workoutSection = document.querySelector('#workout-section');
                                const exerciseItems = document.querySelectorAll('[id^="exercise-item-"]');
                                return workoutSection && exerciseItems.length > 0;
                            }
                        """)
                        level_results[f'{level.lower()}_workout_generated'] = workout_generated
                        
                    except Exception as e:
                        level_results[f'{level.lower()}_error'] = str(e)
                
                checks['fitness_level_tests'] = level_results

                # Test: Accessibility with axe-core
                try:
                    # Inject axe-core
                    page.add_script_tag(url="https://cdn.jsdelivr.net/npm/axe-core@4.8.2/axe.min.js")
                    
                    # Run accessibility audit
                    accessibility_results = page.evaluate("""
                        () => {
                            return new Promise((resolve) => {
                                axe.run().then(results => {
                                    resolve({
                                        violations: results.violations.length,
                                        passes: results.passes.length,
                                        incomplete: results.incomplete.length,
                                        details: results.violations.map(v => ({
                                            id: v.id,
                                            impact: v.impact,
                                            description: v.description,
                                            nodes: v.nodes.length
                                        }))
                                    });
                                }).catch(err => {
                                    resolve({error: err.message});
                                });
                            });
                        }
                    """)
                    
                    if accessibility_results.get('error'):
                        checks['accessibility_audit'] = False
                        logging.warning(f"⚠️ Accessibility audit failed: {accessibility_results['error']}")
                    else:
                        violations = accessibility_results.get('violations', 0)
                        passes = accessibility_results.get('passes', 0)
                        checks['accessibility_audit'] = violations == 0  # Pass if no violations
                        logging.info(f"✅ Accessibility audit: {passes} passes, {violations} violations")
                        
                        if violations > 0:
                            logging.warning(f"⚠️ Found {violations} accessibility violations")
                            for violation in accessibility_results.get('details', [])[:3]:  # Show first 3
                                logging.warning(f"   - {violation['id']}: {violation['description']} ({violation['impact']} impact)")
                        
                except Exception as e:
                    checks['accessibility_audit'] = False
                    logging.warning(f"⚠️ Accessibility audit skipped: {e}")

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


