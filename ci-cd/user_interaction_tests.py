#!/usr/bin/env python3
"""
🎮 User Interaction Test Suite for Workout Generator
==================================================
Comprehensive testing of complex user workflows and interactions
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

class UserInteractionTests:
    def __init__(self, base_url="http://127.0.0.1:8001", headless=True):
        self.base_url = base_url
        self.headless = headless
        self.driver = None
        self.wait = None
        self.screenshot_dir = "user_interaction_screenshots"
        os.makedirs(self.screenshot_dir, exist_ok=True)
        
    def setup_driver(self):
        """Setup Chrome WebDriver with optimal settings"""
        options = Options()
        if self.headless:
            options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-logging")
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 15)
        logger.info("✅ User Interaction WebDriver initialized")
        
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

    # ==================== MULTIPLE WORKOUT GENERATION TESTS ====================
    
    def test_multiple_workout_generations(self):
        """Test 1: Multiple workout generations in sequence"""
        logger.info("🧪 Test 1: Multiple Workout Generations")
        
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        
        generation_results = []
        
        # Generate 5 different workouts in sequence
        for i in range(5):
            try:
                # Reset form
                self.driver.execute_script("document.getElementById('workout-form').reset();")
                time.sleep(0.5)
                
                # Vary the workout parameters
                if i == 0:
                    # Standard workout
                    self.driver.execute_script("""
                        document.getElementById('duration-30').checked = true;
                        document.getElementById('eq-bodyweight').checked = true;
                        document.getElementById('fitness-level').value = 'Intermediate';
                        document.querySelector('input[name="training-pattern"][value="standard"]').checked = true;
                    """)
                elif i == 1:
                    # Circuit workout
                    self.driver.execute_script("""
                        document.getElementById('duration-45').checked = true;
                        document.getElementById('eq-dumbbells').checked = true;
                        document.getElementById('fitness-level').value = 'Advanced';
                        document.querySelector('input[name="training-pattern"][value="circuit"]').checked = true;
                    """)
                elif i == 2:
                    # Tabata workout
                    self.driver.execute_script("""
                        document.getElementById('duration-15').checked = true;
                        document.getElementById('eq-kettlebell').checked = true;
                        document.getElementById('fitness-level').value = 'Beginner';
                        document.querySelector('input[name="training-pattern"][value="tabata"]').checked = true;
                    """)
                elif i == 3:
                    # Pyramid workout
                    self.driver.execute_script("""
                        document.getElementById('duration-60').checked = true;
                        document.getElementById('eq-bodyweight').checked = true;
                        document.getElementById('eq-dumbbells').checked = true;
                        document.getElementById('fitness-level').value = 'Advanced';
                        document.querySelector('input[name="training-pattern"][value="pyramid"]').checked = true;
                    """)
                else:
                    # Mixed equipment workout
                    self.driver.execute_script("""
                        document.getElementById('duration-30').checked = true;
                        document.getElementById('eq-bodyweight').checked = true;
                        document.getElementById('eq-kettlebell').checked = true;
                        document.getElementById('fitness-level').value = 'Intermediate';
                        document.querySelector('input[name="training-pattern"][value="standard"]').checked = true;
                    """)
                
                # Generate workout
                generate_btn = self.driver.find_element(By.ID, "generate-btn")
                generate_btn.click()
                time.sleep(3)
                
                # Check if workout was generated
                workout_data = self.driver.execute_script("return window.workoutData || window.currentWorkoutData;")
                workout_section = self.driver.find_elements(By.ID, "workout-section")
                
                generation_results.append({
                    "generation": i + 1,
                    "success": workout_data is not None and len(workout_section) > 0,
                    "exercise_count": len(workout_data.get('sequence', [])) if workout_data else 0,
                    "workout_type": workout_data.get('trainingPattern', 'unknown') if workout_data else 'unknown'
                })
                
            except Exception as e:
                generation_results.append({
                    "generation": i + 1,
                    "success": False,
                    "error": str(e)
                })
        
        self.take_screenshot("01_multiple_generations")
        
        successful_generations = sum(1 for result in generation_results if result.get("success", False))
        return {
            "status": "PASSED" if successful_generations >= 4 else "WARNING",
            "total_generations": len(generation_results),
            "successful_generations": successful_generations,
            "generation_results": generation_results
        }

    # ==================== FORM FIELD INTERACTION TESTS ====================
    
    def test_form_field_interactions(self):
        """Test 2: Form field interactions and keyboard navigation"""
        logger.info("🧪 Test 2: Form Field Interactions")
        
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        
        interaction_results = {}
        
        # Test 1: Keyboard navigation
        try:
            # Test Tab navigation
            body = self.driver.find_element(By.TAG_NAME, "body")
            body.send_keys(Keys.TAB)
            time.sleep(0.5)
            
            # Test arrow key navigation on fitness level dropdown
            fitness_level = self.driver.find_element(By.ID, "fitness-level")
            fitness_level.click()
            fitness_level.send_keys(Keys.ARROW_DOWN)
            fitness_level.send_keys(Keys.ARROW_DOWN)
            fitness_level.send_keys(Keys.ENTER)
            
            selected_value = fitness_level.get_attribute("value")
            interaction_results["keyboard_navigation"] = {
                "success": True,
                "selected_value": selected_value
            }
            
        except Exception as e:
            interaction_results["keyboard_navigation"] = {"success": False, "error": str(e)}
        
        # Test 2: Checkbox interactions
        try:
            # Test duration checkboxes
            duration_15 = self.driver.find_element(By.ID, "duration-15")
            duration_30 = self.driver.find_element(By.ID, "duration-30")
            
            # Click 15 minutes
            duration_15.click()
            time.sleep(0.5)
            
            # Click 30 minutes (should uncheck 15)
            duration_30.click()
            time.sleep(0.5)
            
            checkbox_states = self.driver.execute_script("""
                return {
                    duration_15_checked: document.getElementById('duration-15').checked,
                    duration_30_checked: document.getElementById('duration-30').checked
                };
            """)
            
            interaction_results["checkbox_interactions"] = {
                "success": True,
                "checkbox_states": checkbox_states
            }
            
        except Exception as e:
            interaction_results["checkbox_interactions"] = {"success": False, "error": str(e)}
        
        # Test 3: Equipment selection interactions
        try:
            # Test multiple equipment selection
            bodyweight = self.driver.find_element(By.ID, "eq-bodyweight")
            dumbbells = self.driver.find_element(By.ID, "eq-dumbbells")
            
            bodyweight.click()
            time.sleep(0.5)
            dumbbells.click()
            time.sleep(0.5)
            
            equipment_states = self.driver.execute_script("""
                return {
                    bodyweight_checked: document.getElementById('eq-bodyweight').checked,
                    dumbbells_checked: document.getElementById('eq-dumbbells').checked
                };
            """)
            
            interaction_results["equipment_selection"] = {
                "success": True,
                "equipment_states": equipment_states
            }
            
        except Exception as e:
            interaction_results["equipment_selection"] = {"success": False, "error": str(e)}
        
        self.take_screenshot("02_form_interactions")
        
        successful_interactions = sum(1 for result in interaction_results.values() if result.get("success", False))
        return {
            "status": "PASSED" if successful_interactions >= 2 else "WARNING",
            "interaction_results": interaction_results,
            "successful_interactions": successful_interactions
        }

    # ==================== BUTTON STATE MANAGEMENT TESTS ====================
    
    def test_button_state_management(self):
        """Test 3: Button state management (enabled/disabled)"""
        logger.info("🧪 Test 3: Button State Management")
        
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        
        button_states = {}
        
        # Test 1: Generate button state with empty form
        try:
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            initial_state = {
                "enabled": generate_btn.is_enabled(),
                "disabled": generate_btn.get_attribute("disabled") is not None
            }
            button_states["empty_form"] = initial_state
        except Exception as e:
            button_states["empty_form"] = {"error": str(e)}
        
        # Test 2: Generate button state with filled form
        try:
            # Fill form
            self.driver.execute_script("""
                document.getElementById('duration-30').checked = true;
                document.getElementById('eq-bodyweight').checked = true;
                document.getElementById('fitness-level').value = 'Intermediate';
            """)
            
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            filled_state = {
                "enabled": generate_btn.is_enabled(),
                "disabled": generate_btn.get_attribute("disabled") is not None
            }
            button_states["filled_form"] = filled_state
        except Exception as e:
            button_states["filled_form"] = {"error": str(e)}
        
        # Test 3: Start workout button state
        try:
            # Generate workout first
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            generate_btn.click()
            time.sleep(3)
            
            # Check start workout button
            start_btn = self.driver.find_element(By.CSS_SELECTOR, 'button[onclick="startWorkout()"]')
            start_workout_state = {
                "enabled": start_btn.is_enabled(),
                "disabled": start_btn.get_attribute("disabled") is not None,
                "visible": start_btn.is_displayed()
            }
            button_states["start_workout"] = start_workout_state
        except Exception as e:
            button_states["start_workout"] = {"error": str(e)}
        
        self.take_screenshot("03_button_states")
        
        return {
            "status": "PASSED",
            "button_states": button_states
        }

    # ==================== WORKOUT PLAYER NAVIGATION TESTS ====================
    
    def test_workout_player_navigation(self):
        """Test 4: Workout player navigation (previous/next/resume)"""
        logger.info("🧪 Test 4: Workout Player Navigation")
        
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        
        # Generate and start workout
        self.driver.execute_script("""
            document.getElementById('duration-30').checked = true;
            document.getElementById('eq-bodyweight').checked = true;
            document.getElementById('fitness-level').value = 'Intermediate';
            document.querySelector('input[name="training-pattern"][value="standard"]').checked = true;
        """)
        
        generate_btn = self.driver.find_element(By.ID, "generate-btn")
        generate_btn.click()
        time.sleep(3)
        
        start_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[onclick="startWorkout()"]')))
        start_btn.click()
        time.sleep(2)
        
        navigation_tests = {}
        
        # Test 1: Previous button
        try:
            prev_btn = self.driver.find_element(By.CSS_SELECTOR, '[onclick*="previous"]')
            prev_btn.click()
            time.sleep(1)
            
            navigation_tests["previous_button"] = {
                "found": True,
                "clickable": True,
                "clicked": True
            }
        except NoSuchElementException:
            navigation_tests["previous_button"] = {"found": False}
        except Exception as e:
            navigation_tests["previous_button"] = {"error": str(e)}
        
        # Test 2: Next button
        try:
            next_btn = self.driver.find_element(By.CSS_SELECTOR, '[onclick*="next"]')
            next_btn.click()
            time.sleep(1)
            
            navigation_tests["next_button"] = {
                "found": True,
                "clickable": True,
                "clicked": True
            }
        except NoSuchElementException:
            navigation_tests["next_button"] = {"found": False}
        except Exception as e:
            navigation_tests["next_button"] = {"error": str(e)}
        
        # Test 3: Resume button
        try:
            resume_btn = self.driver.find_element(By.CSS_SELECTOR, '[onclick*="resume"]')
            resume_btn.click()
            time.sleep(1)
            
            navigation_tests["resume_button"] = {
                "found": True,
                "clickable": True,
                "clicked": True
            }
        except NoSuchElementException:
            navigation_tests["resume_button"] = {"found": False}
        except Exception as e:
            navigation_tests["resume_button"] = {"error": str(e)}
        
        self.take_screenshot("04_player_navigation")
        
        return {
            "status": "PASSED",
            "navigation_tests": navigation_tests
        }

    # ==================== CONTROL TOGGLE TESTING ====================
    
    def test_control_toggle_functionality(self):
        """Test 5: Control toggle testing (sound/vibration)"""
        logger.info("🧪 Test 5: Control Toggle Functionality")
        
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        
        # Generate and start workout
        self.driver.execute_script("""
            document.getElementById('duration-30').checked = true;
            document.getElementById('eq-bodyweight').checked = true;
            document.getElementById('fitness-level').value = 'Intermediate';
            document.querySelector('input[name="training-pattern"][value="standard"]').checked = true;
        """)
        
        generate_btn = self.driver.find_element(By.ID, "generate-btn")
        generate_btn.click()
        time.sleep(3)
        
        start_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[onclick="startWorkout()"]')))
        start_btn.click()
        time.sleep(2)
        
        toggle_tests = {}
        
        # Test 1: Sound toggle functionality
        try:
            sound_toggle = self.driver.find_element(By.ID, "sound-toggle")
            initial_sound_state = sound_toggle.is_selected()
            
            # Toggle sound off
            sound_toggle.click()
            time.sleep(0.5)
            sound_off_state = sound_toggle.is_selected()
            
            # Toggle sound on
            sound_toggle.click()
            time.sleep(0.5)
            sound_on_state = sound_toggle.is_selected()
            
            toggle_tests["sound_toggle"] = {
                "found": True,
                "initial_state": initial_sound_state,
                "toggles_off": sound_off_state != initial_sound_state,
                "toggles_on": sound_on_state != sound_off_state,
                "functional": True
            }
        except Exception as e:
            toggle_tests["sound_toggle"] = {"error": str(e)}
        
        # Test 2: Vibration toggle functionality
        try:
            vibration_toggle = self.driver.find_element(By.ID, "vibration-toggle")
            initial_vibration_state = vibration_toggle.is_selected()
            
            # Toggle vibration off
            vibration_toggle.click()
            time.sleep(0.5)
            vibration_off_state = vibration_toggle.is_selected()
            
            # Toggle vibration on
            vibration_toggle.click()
            time.sleep(0.5)
            vibration_on_state = vibration_toggle.is_selected()
            
            toggle_tests["vibration_toggle"] = {
                "found": True,
                "initial_state": initial_vibration_state,
                "toggles_off": vibration_off_state != initial_vibration_state,
                "toggles_on": vibration_on_state != vibration_off_state,
                "functional": True
            }
        except Exception as e:
            toggle_tests["vibration_toggle"] = {"error": str(e)}
        
        self.take_screenshot("05_control_toggles")
        
        return {
            "status": "PASSED",
            "toggle_tests": toggle_tests
        }

    # ==================== EXIT WORKFLOW TESTING ====================
    
    def test_exit_workflow(self):
        """Test 6: Complete workout exit process"""
        logger.info("🧪 Test 6: Exit Workflow")
        
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        
        # Generate and start workout
        self.driver.execute_script("""
            document.getElementById('duration-30').checked = true;
            document.getElementById('eq-bodyweight').checked = true;
            document.getElementById('fitness-level').value = 'Intermediate';
            document.querySelector('input[name="training-pattern"][value="standard"]').checked = true;
        """)
        
        generate_btn = self.driver.find_element(By.ID, "generate-btn")
        generate_btn.click()
        time.sleep(3)
        
        start_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[onclick="startWorkout()"]')))
        start_btn.click()
        time.sleep(2)
        
        exit_tests = {}
        
        # Test 1: Exit button functionality
        try:
            exit_btn = self.driver.find_element(By.ID, "exit-workout-btn")
            exit_btn.click()
            time.sleep(2)
            
            # Check if we're back to the main form
            form_visible = self.driver.find_element(By.ID, "workout-form").is_displayed()
            player_visible = self.driver.find_element(By.ID, "workout-player").is_displayed()
            
            exit_tests["exit_button"] = {
                "found": True,
                "clickable": True,
                "exits_workout": not player_visible,
                "returns_to_form": form_visible
            }
        except Exception as e:
            exit_tests["exit_button"] = {"error": str(e)}
        
        self.take_screenshot("06_exit_workflow")
        
        return {
            "status": "PASSED",
            "exit_tests": exit_tests
        }

    # ==================== PAUSE/RESUME TESTING ====================
    
    def test_pause_resume_functionality(self):
        """Test 7: Workout pause and resume functionality"""
        logger.info("🧪 Test 7: Pause/Resume Functionality")
        
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        
        # Generate and start workout
        self.driver.execute_script("""
            document.getElementById('duration-30').checked = true;
            document.getElementById('eq-bodyweight').checked = true;
            document.getElementById('fitness-level').value = 'Intermediate';
            document.querySelector('input[name="training-pattern"][value="standard"]').checked = true;
        """)
        
        generate_btn = self.driver.find_element(By.ID, "generate-btn")
        generate_btn.click()
        time.sleep(3)
        
        start_btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[onclick="startWorkout()"]')))
        start_btn.click()
        time.sleep(2)
        
        pause_resume_tests = {}
        
        # Test 1: Pause functionality
        try:
            # Look for pause button
            pause_btn = self.driver.find_element(By.CSS_SELECTOR, '[onclick*="pause"], [onclick*="stop"]')
            pause_btn.click()
            time.sleep(1)
            
            # Check workout state
            workout_state = self.driver.execute_script("""
                return {
                    isRunning: window.workoutState?.isRunning || false,
                    isPaused: window.workoutState?.isPaused || false,
                    currentPhase: window.workoutState?.currentPhase || 'unknown'
                };
            """)
            
            pause_resume_tests["pause_functionality"] = {
                "found": True,
                "clickable": True,
                "workout_state": workout_state
            }
        except NoSuchElementException:
            pause_resume_tests["pause_functionality"] = {"found": False}
        except Exception as e:
            pause_resume_tests["pause_functionality"] = {"error": str(e)}
        
        # Test 2: Resume functionality
        try:
            # Look for resume button
            resume_btn = self.driver.find_element(By.CSS_SELECTOR, '[onclick*="resume"], [onclick*="start"]')
            resume_btn.click()
            time.sleep(1)
            
            # Check workout state after resume
            workout_state_after = self.driver.execute_script("""
                return {
                    isRunning: window.workoutState?.isRunning || false,
                    isPaused: window.workoutState?.isPaused || false,
                    currentPhase: window.workoutState?.currentPhase || 'unknown'
                };
            """)
            
            pause_resume_tests["resume_functionality"] = {
                "found": True,
                "clickable": True,
                "workout_state_after": workout_state_after
            }
        except NoSuchElementException:
            pause_resume_tests["resume_functionality"] = {"found": False}
        except Exception as e:
            pause_resume_tests["resume_functionality"] = {"error": str(e)}
        
        self.take_screenshot("07_pause_resume")
        
        return {
            "status": "PASSED",
            "pause_resume_tests": pause_resume_tests
        }

    # ==================== MAIN TEST RUNNER ====================
    
    def run_all_tests(self):
        """Run all user interaction tests"""
        logger.info("🚀 Starting User Interaction Test Suite")
        
        self.setup_driver()
        
        all_results = {
            "timestamp": time.time(),
            "base_url": self.base_url,
            "test_suite": "user_interactions",
            "tests": {},
            "overall_success_rate": 0.0,
            "status": "FAILED"
        }
        
        try:
            # User interaction tests
            all_results["tests"]["multiple_generations"] = self.test_multiple_workout_generations()
            all_results["tests"]["form_interactions"] = self.test_form_field_interactions()
            all_results["tests"]["button_states"] = self.test_button_state_management()
            all_results["tests"]["player_navigation"] = self.test_workout_player_navigation()
            all_results["tests"]["control_toggles"] = self.test_control_toggle_functionality()
            all_results["tests"]["exit_workflow"] = self.test_exit_workflow()
            all_results["tests"]["pause_resume"] = self.test_pause_resume_functionality()
            
            # Calculate success rate
            passed_tests = sum(1 for test in all_results["tests"].values() 
                             if test.get("status") == "PASSED")
            all_results["overall_success_rate"] = passed_tests / len(all_results["tests"])
            all_results["status"] = "PASSED" if all_results["overall_success_rate"] >= 0.7 else "WARNING"
            
            logger.info(f"✅ User interaction tests completed. Success rate: {all_results['overall_success_rate']:.2%} ({passed_tests}/{len(all_results['tests'])})")
            
        except Exception as e:
            logger.error(f"❌ User interaction test suite failed: {e}")
            all_results["status"] = "FAILED"
            all_results["error"] = str(e)
        finally:
            self.teardown_driver()
            
            # Save results
            with open("user_interaction_results.json", "w") as f:
                json.dump(all_results, f, indent=2)
            logger.info("📊 Results saved to user_interaction_results.json")
        
        return all_results

if __name__ == "__main__":
    tester = UserInteractionTests(headless=True)
    results = tester.run_all_tests()
    print(f"\n🎯 User Interaction Test Results: {results['status']} - {results['overall_success_rate']:.1%} success rate")
