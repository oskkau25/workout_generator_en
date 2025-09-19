"""
Visual Testing Demo - Shows how Selenium captures screenshots during testing

This script demonstrates the visual testing capabilities of Selenium
by running a test and showing the captured screenshots.
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


def visual_testing_demo():
    """Demonstrate visual testing with screenshots"""
    logger.info("🎬 Starting Visual Testing Demo")
    
    # Setup WebDriver with visual options
    options = Options()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    # Note: Not using headless mode for visual demo
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    wait = WebDriverWait(driver, 15)
    
    # Create screenshots directory
    screenshots_dir = Path("visual_demo_screenshots")
    screenshots_dir.mkdir(exist_ok=True)
    
    try:
        # Step 1: Navigate to app
        logger.info("📸 Step 1: Capturing app loading...")
        driver.get("http://127.0.0.1:8001")
        wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        
        # Take screenshot
        screenshot1 = screenshots_dir / "01_app_loaded.png"
        driver.save_screenshot(str(screenshot1))
        logger.info(f"✅ Screenshot saved: {screenshot1}")
        
        # Step 2: Fill form
        logger.info("📸 Step 2: Capturing form filling...")
        
        # Fill form using JavaScript
        driver.execute_script("""
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
        """)
        
        # Take screenshot
        screenshot2 = screenshots_dir / "02_form_filled.png"
        driver.save_screenshot(str(screenshot2))
        logger.info(f"✅ Screenshot saved: {screenshot2}")
        
        # Step 3: Generate workout
        logger.info("📸 Step 3: Capturing workout generation...")
        
        generate_btn = driver.find_element(By.ID, "generate-btn")
        generate_btn.click()
        time.sleep(3)
        
        # Take screenshot
        screenshot3 = screenshots_dir / "03_workout_generated.png"
        driver.save_screenshot(str(screenshot3))
        logger.info(f"✅ Screenshot saved: {screenshot3}")
        
        # Step 4: Start workout
        logger.info("📸 Step 4: Capturing workout start...")
        
        start_btn = driver.find_element(By.CSS_SELECTOR, 'button[onclick="startWorkout()"]')
        start_btn.click()
        time.sleep(2)
        
        # Take screenshot
        screenshot4 = screenshots_dir / "04_workout_started.png"
        driver.save_screenshot(str(screenshot4))
        logger.info(f"✅ Screenshot saved: {screenshot4}")
        
        # Step 5: Test controls
        logger.info("📸 Step 5: Capturing controls testing...")
        
        # Test sound toggle
        sound_toggle = driver.find_element(By.ID, "sound-toggle")
        sound_toggle.click()
        time.sleep(0.5)
        
        # Test vibration toggle
        vibration_toggle = driver.find_element(By.ID, "vibration-toggle")
        vibration_toggle.click()
        time.sleep(0.5)
        
        # Take screenshot
        screenshot5 = screenshots_dir / "05_controls_tested.png"
        driver.save_screenshot(str(screenshot5))
        logger.info(f"✅ Screenshot saved: {screenshot5}")
        
        # Create summary
        summary = {
            "demo_completed": True,
            "screenshots_taken": 5,
            "screenshots_directory": str(screenshots_dir),
            "screenshots": [
                {
                    "step": 1,
                    "description": "App loaded successfully",
                    "file": "01_app_loaded.png",
                    "shows": "Initial app state with workout form"
                },
                {
                    "step": 2,
                    "description": "Form filled with workout parameters",
                    "file": "02_form_filled.png",
                    "shows": "Form with duration, fitness level, equipment selected"
                },
                {
                    "step": 3,
                    "description": "Workout generated",
                    "file": "03_workout_generated.png",
                    "shows": "Generated workout with exercises and start button"
                },
                {
                    "step": 4,
                    "description": "Workout started",
                    "file": "04_workout_started.png",
                    "shows": "Workout player with exercise details and controls"
                },
                {
                    "step": 5,
                    "description": "Controls tested",
                    "file": "05_controls_tested.png",
                    "shows": "Sound and vibration toggles tested, exit button visible"
                }
            ],
            "visual_testing_capabilities": [
                "Screenshot capture at each test step",
                "Visual verification of UI state changes",
                "Documentation of test execution",
                "Debugging support for failed tests",
                "Regression testing with visual comparisons",
                "Cross-browser visual testing",
                "Mobile device visual testing",
                "Responsive design testing"
            ]
        }
        
        logger.info("🎉 Visual testing demo completed successfully!")
        return summary
        
    except Exception as e:
        logger.error(f"❌ Visual testing demo failed: {e}")
        return {"demo_completed": False, "error": str(e)}
    
    finally:
        driver.quit()
        logger.info("🔚 WebDriver closed")


def main():
    """Main function"""
    summary = visual_testing_demo()
    
    # Output summary
    print(json.dumps(summary, indent=2))
    
    # Save summary
    with open("visual_testing_summary.json", 'w') as f:
        json.dump(summary, f, indent=2)
    
    logger.info("📊 Visual testing summary saved to visual_testing_summary.json")


if __name__ == "__main__":
    main()
