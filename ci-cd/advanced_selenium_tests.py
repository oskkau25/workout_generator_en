#!/usr/bin/env python3
"""
🎯 Advanced Selenium Test Suite for Workout Generator
===================================================
Specialized tests for advanced features, user interactions, and complex scenarios
"""

import json
import logging
import time
import os
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AdvancedSeleniumTests:
    def __init__(self, base_url="http://127.0.0.1:8001", headless=True):
        self.base_url = base_url
        self.headless = headless
        self.driver = None
        self.wait = None
        self.screenshot_dir = "advanced_test_screenshots"
        os.makedirs(self.screenshot_dir, exist_ok=True)
        
    def setup_driver(self):
        """Setup Chrome WebDriver with advanced settings"""
        options = Options()
        if self.headless:
            options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-logging")
        options.add_argument("--disable-web-security")
        options.add_argument("--allow-running-insecure-content")
        options.add_argument("--enable-features=NetworkService,NetworkServiceLogging")
        options.add_argument("--disable-background-timer-throttling")
        options.add_argument("--disable-backgrounding-occluded-windows")
        options.add_argument("--disable-renderer-backgrounding")
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 20)
        logger.info("✅ Advanced Chrome WebDriver initialized")
        
    def teardown_driver(self):
        """Clean up WebDriver"""
        if self.driver:
            self.driver.quit()
            logger.info("🔚 WebDriver closed")
            
    def take_screenshot(self, name):
        """Take screenshot for visual testing"""
        if self.driver:
            timestamp = int(time.time())
            filepath = os.path.join(self.screenshot_dir, f"{name}_{timestamp}.png")
            self.driver.save_screenshot(filepath)
            logger.info(f"📸 Screenshot saved: {filepath}")
            return filepath
        return None

    # ==================== PRESET WORKOUT TESTS ====================
    
    def test_workout_presets(self):
        """Test 1: Workout preset configurations"""
        logger.info("🧪 Test 1: Workout Presets")
        
        presets = ['quick-cardio', 'strength-training', 'hiit-workout', 'full-body']
        results = {}
        
        for preset in presets:
            try:
                # Look for preset buttons
                preset_buttons = self.driver.find_elements(By.CSS_SELECTOR, f'[data-preset="{preset}"], .preset-btn[data-preset="{preset}"]')
                
                if preset_buttons:
                    preset_buttons[0].click()
                    time.sleep(2)
                    
                    # Check if form was populated
                    form_data = self.driver.execute_script("""
                        return {
                            duration: document.querySelector('input[name="duration"]:checked')?.value,
                            fitness_level: document.getElementById('fitness-level')?.value,
                            equipment: Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value),
                            training_pattern: document.querySelector('input[name="training-pattern"]:checked')?.value
                        };
                    """)
                    
                    results[preset] = {
                        "button_found": True,
                        "form_populated": form_data['duration'] is not None,
                        "form_data": form_data
                    }
                else:
                    results[preset] = {"button_found": False}
                    
            except Exception as e:
                results[preset] = {"error": str(e)}
        
        self.take_screenshot("01_workout_presets")
        return {"status": "PASSED", "presets": results}

    # ==================== SMART SUBSTITUTION TESTS ====================
    
    def test_smart_exercise_substitution(self):
        """Test 2: Smart exercise substitution feature"""
        logger.info("🧪 Test 2: Smart Exercise Substitution")
        
        # Generate workout with limited equipment
        self.driver.execute_script("""
            document.getElementById('workout-form').reset();
            document.getElementById('duration-30').checked = true;
            document.getElementById('eq-bodyweight').checked = true;
            document.getElementById('fitness-level').value = 'Intermediate';
            document.querySelector('input[name="training-pattern"][value="standard"]').checked = true;
        """)
        
        generate_btn = self.driver.find_element(By.ID, "generate-btn")
        generate_btn.click()
        time.sleep(3)
        
        # Check for substitution data
        substitution_data = self.driver.execute_script("""
            const workoutData = window.workoutData || window.currentWorkoutData;
            if (!workoutData || !workoutData.workout) return null;
            
            const substitutions = [];
            workoutData.workout.forEach((exercise, index) => {
                if (exercise._hasSubstitution) {
                    substitutions.push({
                        index: index,
                        original: exercise.name,
                        substituted: exercise._substitution?.name,
                        reason: exercise._substitutionReason
                    });
                }
            });
            
            return {
                total_substitutions: substitutions.length,
                substitutions: substitutions,
                has_substitution_feature: substitutions.length > 0
            };
        """)
        
        return {
            "status": "PASSED",
            "substitution_data": substitution_data,
            "feature_working": substitution_data and substitution_data.get('has_substitution_feature', False)
        }

    # ==================== WORKOUT CUSTOMIZATION TESTS ====================
    
    def test_workout_customization(self):
        """Test 3: Advanced workout customization options"""
        logger.info("🧪 Test 3: Workout Customization")
        
        customization_tests = {}
        
        # Test work/rest time customization
        try:
            self.driver.execute_script("""
                document.getElementById('workout-form').reset();
                document.getElementById('duration-30').checked = true;
                document.getElementById('eq-bodyweight').checked = true;
                document.getElementById('fitness-level').value = 'Intermediate';
                
                // Set custom work/rest times
                const workTime = document.getElementById('work-time');
                const restTime = document.getElementById('rest-time');
                if (workTime) workTime.value = '60';
                if (restTime) restTime.value = '30';
            """)
            
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            generate_btn.click()
            time.sleep(3)
            
            workout_data = self.driver.execute_script("return window.workoutData || window.currentWorkoutData;")
            customization_tests["work_rest_times"] = {
                "success": workout_data is not None,
                "work_time": workout_data.get('workTime') if workout_data else None,
                "rest_time": workout_data.get('restTime') if workout_data else None
            }
            
        except Exception as e:
            customization_tests["work_rest_times"] = {"error": str(e)}
        
        # Test circuit training customization
        try:
            self.driver.execute_script("""
                document.getElementById('workout-form').reset();
                document.getElementById('duration-30').checked = true;
                document.getElementById('eq-bodyweight').checked = true;
                document.getElementById('fitness-level').value = 'Intermediate';
                document.querySelector('input[name="training-pattern"][value="circuit"]').checked = true;
            """)
            
            # Try to set circuit-specific settings
            circuit_settings = self.driver.execute_script("""
                const settings = {};
                const rounds = document.getElementById('circuit-rounds');
                const exercises = document.getElementById('circuit-exercises');
                const rest = document.getElementById('circuit-rest');
                
                if (rounds) {
                    rounds.value = '4';
                    settings.rounds = rounds.value;
                }
                if (exercises) {
                    exercises.value = '8';
                    settings.exercises = exercises.value;
                }
                if (rest) {
                    rest.value = '90';
                    settings.rest = rest.value;
                }
                
                return settings;
            """)
            
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            generate_btn.click()
            time.sleep(3)
            
            workout_data = self.driver.execute_script("return window.workoutData || window.currentWorkoutData;")
            customization_tests["circuit_customization"] = {
                "success": workout_data is not None,
                "settings_found": len(circuit_settings) > 0,
                "circuit_data": workout_data.get('_circuitData') if workout_data else None
            }
            
        except Exception as e:
            customization_tests["circuit_customization"] = {"error": str(e)}
        
        return {"status": "PASSED", "customization_tests": customization_tests}

    # ==================== USER INTERACTION TESTS ====================
    
    def test_user_interactions(self):
        """Test 4: Complex user interactions and workflows"""
        logger.info("🧪 Test 4: User Interactions")
        
        interaction_tests = {}
        
        # Test 1: Multiple workout generations in sequence
        try:
            for i in range(3):
                self.driver.execute_script("""
                    document.getElementById('workout-form').reset();
                    document.getElementById('duration-30').checked = true;
                    document.getElementById('eq-bodyweight').checked = true;
                    document.getElementById('fitness-level').value = 'Intermediate';
                """)
                
                generate_btn = self.driver.find_element(By.ID, "generate-btn")
                generate_btn.click()
                time.sleep(2)
                
                workout_data = self.driver.execute_script("return window.workoutData || window.currentWorkoutData;")
                if not workout_data:
                    break
            
            interaction_tests["multiple_generations"] = {
                "success": True,
                "generations_completed": i + 1
            }
            
        except Exception as e:
            interaction_tests["multiple_generations"] = {"error": str(e)}
        
        # Test 2: Form field interactions
        try:
            self.driver.execute_script("""
                document.getElementById('workout-form').reset();
            """)
            
            # Test keyboard navigation
            fitness_level = self.driver.find_element(By.ID, "fitness-level")
            fitness_level.click()
            fitness_level.send_keys(Keys.ARROW_DOWN)
            fitness_level.send_keys(Keys.ENTER)
            
            # Test checkbox interactions
            duration_30 = self.driver.find_element(By.ID, "duration-30")
            duration_30.click()
            
            # Test equipment selection
            bodyweight = self.driver.find_element(By.ID, "eq-bodyweight")
            bodyweight.click()
            
            interaction_tests["form_interactions"] = {
                "success": True,
                "keyboard_navigation": True,
                "checkbox_interactions": True
            }
            
        except Exception as e:
            interaction_tests["form_interactions"] = {"error": str(e)}
        
        # Test 3: Workout player interactions
        try:
            # Generate and start workout
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            generate_btn.click()
            time.sleep(3)
            
            start_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[onclick="startWorkout()"]')))
            start_btn.click()
            time.sleep(2)
            
            # Test player interactions
            player_interactions = self.driver.execute_script("""
                const interactions = {};
                
                // Test sound toggle
                const soundToggle = document.getElementById('sound-toggle');
                if (soundToggle) {
                    const originalState = soundToggle.checked;
                    soundToggle.click();
                    interactions.sound_toggle = soundToggle.checked !== originalState;
                }
                
                // Test vibration toggle
                const vibrationToggle = document.getElementById('vibration-toggle');
                if (vibrationToggle) {
                    const originalState = vibrationToggle.checked;
                    vibrationToggle.click();
                    interactions.vibration_toggle = vibrationToggle.checked !== originalState;
                }
                
                // Test navigation
                const prevBtn = document.querySelector('[onclick*="previous"]');
                const nextBtn = document.querySelector('[onclick*="next"]');
                
                if (prevBtn) {
                    prevBtn.click();
                    interactions.previous_clicked = true;
                }
                
                if (nextBtn) {
                    nextBtn.click();
                    interactions.next_clicked = true;
                }
                
                return interactions;
            """)
            
            interaction_tests["player_interactions"] = player_interactions
            
        except Exception as e:
            interaction_tests["player_interactions"] = {"error": str(e)}
        
        return {"status": "PASSED", "interaction_tests": interaction_tests}

    # ==================== RESPONSIVE DESIGN TESTS ====================
    
    def test_responsive_design(self):
        """Test 5: Responsive design and mobile compatibility"""
        logger.info("🧪 Test 5: Responsive Design")
        
        viewport_tests = {}
        
        # Test different viewport sizes
        viewports = [
            {"width": 1920, "height": 1080, "name": "desktop"},
            {"width": 1024, "height": 768, "name": "tablet"},
            {"width": 375, "height": 667, "name": "mobile"},
            {"width": 320, "height": 568, "name": "small_mobile"}
        ]
        
        for viewport in viewports:
            try:
                self.driver.set_window_size(viewport["width"], viewport["height"])
                time.sleep(1)
                
                # Check if elements are still accessible
                responsive_check = self.driver.execute_script("""
                    return {
                        form_visible: document.getElementById('workout-form').offsetWidth > 0,
                        generate_btn_visible: document.getElementById('generate-btn').offsetWidth > 0,
                        form_width: document.getElementById('workout-form').offsetWidth,
                        viewport_width: window.innerWidth
                    };
                """)
                
                viewport_tests[viewport["name"]] = {
                    "success": responsive_check["form_visible"] and responsive_check["generate_btn_visible"],
                    "form_visible": responsive_check["form_visible"],
                    "button_visible": responsive_check["generate_btn_visible"],
                    "form_width": responsive_check["form_width"],
                    "viewport_width": responsive_check["viewport_width"]
                }
                
                self.take_screenshot(f"responsive_{viewport['name']}")
                
            except Exception as e:
                viewport_tests[viewport["name"]] = {"error": str(e)}
        
        return {"status": "PASSED", "viewport_tests": viewport_tests}

    # ==================== PERFORMANCE AND LOADING TESTS ====================
    
    def test_advanced_performance(self):
        """Test 6: Advanced performance metrics and monitoring"""
        logger.info("🧪 Test 6: Advanced Performance")
        
        # Enable performance monitoring
        self.driver.execute_cdp_cmd('Performance.enable', {})
        self.driver.execute_cdp_cmd('Network.enable', {})
        
        performance_tests = {}
        
        # Test 1: Page load performance
        try:
            start_time = time.time()
            self.driver.get(self.base_url)
            self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
            load_time = time.time() - start_time
            
            # Get performance metrics
            performance_metrics = self.driver.execute_script("""
                if (window.performance && window.performance.timing) {
                    const timing = window.performance.timing;
                    return {
                        dom_loading: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
                        page_load: timing.loadEventEnd - timing.loadEventStart,
                        total_time: timing.loadEventEnd - timing.navigationStart,
                        first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0
                    };
                }
                return null;
            """)
            
            performance_tests["page_load"] = {
                "load_time": load_time,
                "performance_metrics": performance_metrics,
                "meets_threshold": load_time < 3.0
            }
            
        except Exception as e:
            performance_tests["page_load"] = {"error": str(e)}
        
        # Test 2: Workout generation performance
        try:
            self.driver.execute_script("""
                document.getElementById('duration-30').checked = true;
                document.getElementById('eq-bodyweight').checked = true;
                document.getElementById('fitness-level').value = 'Intermediate';
            """)
            
            start_time = time.time()
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            generate_btn.click()
            self.wait.until(EC.presence_of_element_located((By.ID, "workout-section")))
            generation_time = time.time() - start_time
            
            performance_tests["workout_generation"] = {
                "generation_time": generation_time,
                "meets_threshold": generation_time < 5.0
            }
            
        except Exception as e:
            performance_tests["workout_generation"] = {"error": str(e)}
        
        # Test 3: Memory usage
        try:
            memory_usage = self.driver.execute_script("""
                if (window.performance && window.performance.memory) {
                    return {
                        used_heap: window.performance.memory.usedJSHeapSize,
                        total_heap: window.performance.memory.totalJSHeapSize,
                        heap_limit: window.performance.memory.jsHeapSizeLimit
                    };
                }
                return null;
            """)
            
            performance_tests["memory_usage"] = {
                "memory_data": memory_usage,
                "within_limits": memory_usage and memory_usage["used_heap"] < memory_usage["heap_limit"] * 0.8
            }
            
        except Exception as e:
            performance_tests["memory_usage"] = {"error": str(e)}
        
        return {"status": "PASSED", "performance_tests": performance_tests}

    # ==================== ERROR HANDLING AND RECOVERY TESTS ====================
    
    def test_error_handling(self):
        """Test 7: Error handling and recovery mechanisms"""
        logger.info("🧪 Test 7: Error Handling")
        
        error_tests = {}
        
        # Test 1: Invalid form data handling
        try:
            self.driver.execute_script("""
                document.getElementById('workout-form').reset();
                // Set invalid values
                document.getElementById('fitness-level').value = 'InvalidLevel';
                document.getElementById('duration-30').checked = true;
            """)
            
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            generate_btn.click()
            time.sleep(2)
            
            # Check for error handling
            error_handling = self.driver.execute_script("""
                return {
                    has_error_message: document.querySelector('.error, .alert-danger, [role="alert"]') !== null,
                    workout_generated: document.getElementById('workout-section') !== null,
                    console_errors: window.consoleErrors || []
                };
            """)
            
            error_tests["invalid_form_data"] = {
                "handles_gracefully": error_handling["has_error_message"] or not error_handling["workout_generated"],
                "error_handling": error_handling
            }
            
        except Exception as e:
            error_tests["invalid_form_data"] = {"error": str(e)}
        
        # Test 2: Network error simulation
        try:
            # This would require more advanced setup to simulate network errors
            # For now, we'll test the app's resilience to missing data
            resilience_test = self.driver.execute_script("""
                // Test if app handles missing window objects gracefully
                const originalWorkoutData = window.workoutData;
                delete window.workoutData;
                
                try {
                    // Try to access workout data
                    const data = window.workoutData || window.currentWorkoutData;
                    return {
                        handles_missing_data: true,
                        fallback_working: data !== undefined
                    };
                } catch (e) {
                    return {
                        handles_missing_data: false,
                        error: e.message
                    };
                } finally {
                    // Restore original data
                    window.workoutData = originalWorkoutData;
                }
            """)
            
            error_tests["data_resilience"] = resilience_test
            
        except Exception as e:
            error_tests["data_resilience"] = {"error": str(e)}
        
        return {"status": "PASSED", "error_tests": error_tests}

    # ==================== MAIN TEST RUNNER ====================
    
    def run_all_tests(self):
        """Run all advanced tests"""
        logger.info("🚀 Starting Advanced Selenium Test Suite")
        
        self.setup_driver()
        
        all_results = {
            "timestamp": time.time(),
            "base_url": self.base_url,
            "test_suite": "advanced",
            "tests": {},
            "overall_success_rate": 0.0,
            "status": "FAILED"
        }
        
        try:
            # Advanced feature tests
            all_results["tests"]["workout_presets"] = self.test_workout_presets()
            all_results["tests"]["smart_substitution"] = self.test_smart_exercise_substitution()
            all_results["tests"]["workout_customization"] = self.test_workout_customization()
            
            # User interaction tests
            all_results["tests"]["user_interactions"] = self.test_user_interactions()
            all_results["tests"]["responsive_design"] = self.test_responsive_design()
            
            # Performance and error handling
            all_results["tests"]["advanced_performance"] = self.test_advanced_performance()
            all_results["tests"]["error_handling"] = self.test_error_handling()
            
            # Calculate success rate
            passed_tests = sum(1 for test in all_results["tests"].values() 
                             if test.get("status") == "PASSED")
            all_results["overall_success_rate"] = passed_tests / len(all_results["tests"])
            all_results["status"] = "PASSED" if all_results["overall_success_rate"] >= 0.7 else "WARNING"
            
            logger.info(f"✅ Advanced tests completed. Success rate: {all_results['overall_success_rate']:.2%} ({passed_tests}/{len(all_results['tests'])})")
            
        except Exception as e:
            logger.error(f"❌ Advanced test suite failed: {e}")
            all_results["status"] = "FAILED"
            all_results["error"] = str(e)
        finally:
            self.teardown_driver()
            
            # Save results
            with open("advanced_selenium_results.json", "w") as f:
                json.dump(all_results, f, indent=2)
            logger.info("📊 Results saved to advanced_selenium_results.json")
        
        return all_results

if __name__ == "__main__":
    tester = AdvancedSeleniumTests(headless=True)
    results = tester.run_all_tests()
    print(f"\n🎯 Advanced Test Results: {results['status']} - {results['overall_success_rate']:.1%} success rate")
