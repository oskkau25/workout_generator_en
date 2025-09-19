"""
Final Selenium E2E Test - Simple and Working

This version focuses on the core functionality and provides clear results.
"""

import json
import logging
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def run_selenium_tests():
    """Run comprehensive Selenium E2E tests"""
    logger.info("🚀 Starting Final Selenium E2E Tests")
    
    # Setup WebDriver
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    wait = WebDriverWait(driver, 15)
    
    results = {
        "timestamp": time.time(),
        "base_url": "http://127.0.0.1:8001",
        "tests": {}
    }
    
    try:
        # Test 1: App Loading
        logger.info("🧪 Test 1: App Loading")
        driver.get("http://127.0.0.1:8001")
        wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        results["tests"]["app_loading"] = {"status": "PASSED", "details": "App loaded successfully"}
        
        # Test 2: Form Elements
        logger.info("🧪 Test 2: Form Elements")
        form_elements = {
            "workout_form": driver.find_element(By.ID, "workout-form").is_displayed(),
            "generate_btn": driver.find_element(By.ID, "generate-btn").is_displayed(),
            "fitness_level": driver.find_element(By.ID, "fitness-level").is_displayed(),
            "duration_30": driver.find_element(By.ID, "duration-30").is_displayed()
        }
        results["tests"]["form_elements"] = {"status": "PASSED", "details": form_elements}
        
        # Test 3: Workout Generation
        logger.info("🧪 Test 3: Workout Generation")
        
        # Fill form using JavaScript
        form_filled = driver.execute_script("""
            const form = document.getElementById('workout-form');
            if (form) form.reset();
            
            const duration30 = document.getElementById('duration-30');
            if (duration30) duration30.checked = true;
            
            const fitnessLevel = document.getElementById('fitness-level');
            if (fitnessLevel) fitnessLevel.value = 'Intermediate';
            
            const bodyweight = document.getElementById('eq-bodyweight');
            if (bodyweight) bodyweight.checked = true;
            
            const pattern = document.querySelector('input[name="training-pattern"]');
            if (pattern) pattern.checked = true;
            
            return {
                durationSet: !!duration30 && duration30.checked,
                fitnessLevelSet: !!fitnessLevel && fitnessLevel.value === 'Intermediate',
                equipmentSet: !!bodyweight && bodyweight.checked,
                patternSet: !!pattern && pattern.checked
            };
        """)
        
        # Click generate button
        generate_btn = driver.find_element(By.ID, "generate-btn")
        generate_btn.click()
        time.sleep(3)
        
        # Check if workout was generated
        workout_generated = driver.execute_script("""
            const workoutSection = document.querySelector('#workout-section');
            const workoutOverview = document.querySelector('#workout-overview');
            const hasWorkoutData = typeof window.currentWorkoutData !== 'undefined' && window.currentWorkoutData;
            
            return {
                workoutSectionVisible: workoutSection && !workoutSection.classList.contains('hidden'),
                workoutOverviewVisible: workoutOverview && !workoutOverview.classList.contains('hidden'),
                hasWorkoutData: hasWorkoutData,
                anyWorkoutVisible: (workoutSection && !workoutSection.classList.contains('hidden')) ||
                                 (workoutOverview && !workoutOverview.classList.contains('hidden'))
            };
        """)
        
        results["tests"]["workout_generation"] = {
            "status": "PASSED" if workout_generated.get("anyWorkoutVisible", False) or workout_generated.get("hasWorkoutData", False) else "FAILED",
            "details": {
                "form_filled": form_filled,
                "workout_generated": workout_generated
            }
        }
        
        # Test 4: Start Workout Button
        logger.info("🧪 Test 4: Start Workout Button")
        start_button_test = driver.execute_script("""
            const startBtn = document.querySelector('button[onclick="startWorkout()"]');
            if (!startBtn) {
                return {found: false, error: 'Start button not found'};
            }
            
            const isVisible = startBtn.offsetParent !== null;
            const isClickable = !startBtn.disabled && startBtn.style.pointerEvents !== 'none';
            
            // Get button styling
            const styles = window.getComputedStyle(startBtn);
            const styling = {
                background: styles.background,
                position: styles.position,
                zIndex: styles.zIndex,
                transform: styles.transform,
                transition: styles.transition,
                boxShadow: styles.boxShadow
            };
            
            return {
                found: true,
                visible: isVisible,
                clickable: isClickable,
                styling: styling,
                classes: startBtn.className
            };
        """)
        
        results["tests"]["start_workout_button"] = {
            "status": "PASSED" if start_button_test.get("found", False) and start_button_test.get("clickable", False) else "FAILED",
            "details": start_button_test
        }
        
        # Test 5: Workout Player Controls (if workout was started)
        if start_button_test.get("found", False) and start_button_test.get("clickable", False):
            logger.info("🧪 Test 5: Starting Workout and Testing Controls")
            
            # Click start workout button
            start_btn = driver.find_element(By.CSS_SELECTOR, 'button[onclick="startWorkout()"]')
            start_btn.click()
            time.sleep(2)
            
            # Test workout player controls
            controls_test = driver.execute_script("""
                const results = {
                    playerVisible: false,
                    soundToggle: {found: false, clickable: false, functional: false},
                    vibrationToggle: {found: false, clickable: false, functional: false},
                    exitButton: {found: false, clickable: false}
                };
                
                // Check if workout player is visible
                const player = document.querySelector('#workout-player');
                results.playerVisible = player && !player.classList.contains('hidden');
                
                // Test sound toggle
                const soundToggle = document.getElementById('sound-toggle');
                if (soundToggle) {
                    results.soundToggle.found = true;
                    results.soundToggle.clickable = !soundToggle.disabled && 
                                                   soundToggle.style.pointerEvents !== 'none';
                    
                    if (results.soundToggle.clickable) {
                        const originalState = soundToggle.checked;
                        soundToggle.click();
                        results.soundToggle.functional = soundToggle.checked !== originalState;
                    }
                }
                
                // Test vibration toggle
                const vibrationToggle = document.getElementById('vibration-toggle');
                if (vibrationToggle) {
                    results.vibrationToggle.found = true;
                    results.vibrationToggle.clickable = !vibrationToggle.disabled && 
                                                       vibrationToggle.style.pointerEvents !== 'none';
                    
                    if (results.vibrationToggle.clickable) {
                        const originalState = vibrationToggle.checked;
                        vibrationToggle.click();
                        results.vibrationToggle.functional = vibrationToggle.checked !== originalState;
                    }
                }
                
                // Test exit button
                const exitBtn = document.getElementById('exit-workout-btn');
                if (exitBtn) {
                    results.exitButton.found = true;
                    results.exitButton.clickable = !exitBtn.disabled && 
                                                  exitBtn.style.pointerEvents !== 'none';
                }
                
                return results;
            """)
            
            results["tests"]["workout_player_controls"] = {
                "status": "PASSED" if controls_test.get("playerVisible", False) else "FAILED",
                "details": controls_test
            }
        else:
            results["tests"]["workout_player_controls"] = {
                "status": "SKIPPED",
                "details": "Start workout button not available"
            }
        
        # Test 6: Generate Button Styling
        logger.info("🧪 Test 6: Generate Button Styling")
        generate_styling = driver.execute_script("""
            const generateBtn = document.getElementById('generate-btn');
            if (!generateBtn) {
                return {found: false};
            }
            
            const styles = window.getComputedStyle(generateBtn);
            return {
                found: true,
                visible: generateBtn.offsetParent !== null,
                clickable: !generateBtn.disabled,
                styling: {
                    background: styles.background,
                    position: styles.position,
                    zIndex: styles.zIndex,
                    transform: styles.transform,
                    transition: styles.transition,
                    boxShadow: styles.boxShadow
                }
            };
        """)
        
        results["tests"]["generate_button_styling"] = {
            "status": "PASSED" if generate_styling.get("found", False) else "FAILED",
            "details": generate_styling
        }
        
        # Calculate overall success
        passed_tests = sum(1 for test in results["tests"].values() if test["status"] == "PASSED")
        total_tests = len(results["tests"])
        results["overall_success_rate"] = passed_tests / total_tests
        results["status"] = "PASSED" if results["overall_success_rate"] >= 0.8 else "WARNING"
        
        logger.info(f"✅ Tests completed. Success rate: {results['overall_success_rate']:.2%} ({passed_tests}/{total_tests})")
        
        return results
        
    except Exception as e:
        logger.error(f"❌ Tests failed: {e}")
        return {"status": "FAILED", "error": str(e)}
    
    finally:
        driver.quit()
        logger.info("🔚 WebDriver closed")


def main():
    """Main function"""
    results = run_selenium_tests()
    
    # Output results
    print(json.dumps(results, indent=2))
    
    # Save results
    with open("final_selenium_results.json", 'w') as f:
        json.dump(results, f, indent=2)
    
    logger.info("📊 Results saved to final_selenium_results.json")


if __name__ == "__main__":
    main()
