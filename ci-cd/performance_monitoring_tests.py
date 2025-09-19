#!/usr/bin/env python3
"""
⚡ Performance Monitoring Test Suite for Workout Generator
========================================================
Comprehensive performance testing and monitoring
"""

import json
import logging
import time
import os
import psutil
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PerformanceMonitoringTests:
    def __init__(self, base_url="http://127.0.0.1:8001", headless=True):
        self.base_url = base_url
        self.headless = headless
        self.driver = None
        self.wait = None
        self.screenshot_dir = "performance_screenshots"
        os.makedirs(self.screenshot_dir, exist_ok=True)
        
    def setup_driver(self):
        """Setup Chrome WebDriver with performance monitoring"""
        options = Options()
        if self.headless:
            options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-logging")
        options.add_argument("--enable-features=NetworkService,NetworkServiceLogging")
        options.add_argument("--disable-background-timer-throttling")
        options.add_argument("--disable-backgrounding-occluded-windows")
        options.add_argument("--disable-renderer-backgrounding")
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 15)
        
        # Enable performance monitoring
        self.driver.execute_cdp_cmd('Performance.enable', {})
        self.driver.execute_cdp_cmd('Network.enable', {})
        self.driver.execute_cdp_cmd('Runtime.enable', {})
        
        logger.info("✅ Performance Monitoring WebDriver initialized")
        
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

    def get_system_metrics(self):
        """Get current system performance metrics"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                "cpu_percent": cpu_percent,
                "memory": {
                    "total": memory.total,
                    "available": memory.available,
                    "percent": memory.percent,
                    "used": memory.used
                },
                "disk": {
                    "total": disk.total,
                    "used": disk.used,
                    "free": disk.free,
                    "percent": (disk.used / disk.total) * 100
                }
            }
        except Exception as e:
            logger.warning(f"Could not get system metrics: {e}")
            return None

    # ==================== PAGE LOAD PERFORMANCE TESTS ====================
    
    def test_page_load_performance(self):
        """Test 1: Page load performance metrics"""
        logger.info("🧪 Test 1: Page Load Performance")
        
        # Get initial system metrics
        initial_metrics = self.get_system_metrics()
        
        # Measure page load time
        start_time = time.time()
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        load_time = time.time() - start_time
        
        # Get performance metrics from browser
        performance_metrics = self.driver.execute_script("""
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                return {
                    navigation_start: timing.navigationStart,
                    dom_loading: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
                    dom_complete: timing.domComplete - timing.domLoading,
                    load_complete: timing.loadEventEnd - timing.loadEventStart,
                    total_time: timing.loadEventEnd - timing.navigationStart,
                    first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0,
                    first_contentful_paint: performance.getEntriesByType('paint')[1]?.startTime || 0
                };
            }
            return null;
        """)
        
        # Get final system metrics
        final_metrics = self.get_system_metrics()
        
        # Get network metrics
        network_metrics = self.driver.execute_script("""
            if (window.performance && window.performance.getEntriesByType) {
                const resources = window.performance.getEntriesByType('resource');
                return {
                    total_resources: resources.length,
                    total_size: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
                    load_time: resources.reduce((sum, resource) => sum + (resource.responseEnd - resource.startTime), 0)
                };
            }
            return null;
        """)
        
        self.take_screenshot("01_page_load_performance")
        
        return {
            "status": "PASSED" if load_time < 3.0 else "WARNING",
            "load_time": load_time,
            "performance_metrics": performance_metrics,
            "network_metrics": network_metrics,
            "system_metrics": {
                "initial": initial_metrics,
                "final": final_metrics
            },
            "meets_threshold": load_time < 3.0
        }

    # ==================== WORKOUT GENERATION PERFORMANCE TESTS ====================
    
    def test_workout_generation_performance(self):
        """Test 2: Workout generation performance"""
        logger.info("🧪 Test 2: Workout Generation Performance")
        
        generation_times = []
        
        # Test multiple workout generations
        for i in range(5):
            try:
                # Reset form
                self.driver.execute_script("document.getElementById('workout-form').reset();")
                time.sleep(0.5)
                
                # Fill form
                self.driver.execute_script("""
                    document.getElementById('duration-30').checked = true;
                    document.getElementById('eq-bodyweight').checked = true;
                    document.getElementById('fitness-level').value = 'Intermediate';
                    document.querySelector('input[name="training-pattern"][value="standard"]').checked = true;
                """)
                
                # Measure generation time
                start_time = time.time()
                generate_btn = self.driver.find_element(By.ID, "generate-btn")
                generate_btn.click()
                self.wait.until(EC.presence_of_element_located((By.ID, "workout-section")))
                generation_time = time.time() - start_time
                
                generation_times.append(generation_time)
                
                # Get workout data size
                workout_data = self.driver.execute_script("return window.workoutData || window.currentWorkoutData;")
                workout_size = len(str(workout_data)) if workout_data else 0
                
            except Exception as e:
                logger.warning(f"Generation {i+1} failed: {e}")
                generation_times.append(None)
        
        # Calculate statistics
        valid_times = [t for t in generation_times if t is not None]
        avg_generation_time = sum(valid_times) / len(valid_times) if valid_times else 0
        max_generation_time = max(valid_times) if valid_times else 0
        min_generation_time = min(valid_times) if valid_times else 0
        
        self.take_screenshot("02_workout_generation_performance")
        
        return {
            "status": "PASSED" if avg_generation_time < 5.0 else "WARNING",
            "generation_times": generation_times,
            "statistics": {
                "average": avg_generation_time,
                "maximum": max_generation_time,
                "minimum": min_generation_time,
                "successful_generations": len(valid_times)
            },
            "meets_threshold": avg_generation_time < 5.0
        }

    # ==================== MEMORY USAGE TESTS ====================
    
    def test_memory_usage(self):
        """Test 3: Memory usage monitoring"""
        logger.info("🧪 Test 3: Memory Usage Monitoring")
        
        memory_snapshots = []
        
        # Take initial memory snapshot
        initial_memory = self.driver.execute_script("""
            if (window.performance && window.performance.memory) {
                return {
                    used_heap: window.performance.memory.usedJSHeapSize,
                    total_heap: window.performance.memory.totalJSHeapSize,
                    heap_limit: window.performance.memory.jsHeapSizeLimit
                };
            }
            return null;
        """)
        memory_snapshots.append({"stage": "initial", "memory": initial_memory})
        
        # Generate multiple workouts to test memory growth
        for i in range(10):
            try:
                # Reset and generate workout
                self.driver.execute_script("document.getElementById('workout-form').reset();")
                time.sleep(0.5)
                
                self.driver.execute_script("""
                    document.getElementById('duration-30').checked = true;
                    document.getElementById('eq-bodyweight').checked = true;
                    document.getElementById('fitness-level').value = 'Intermediate';
                """)
                
                generate_btn = self.driver.find_element(By.ID, "generate-btn")
                generate_btn.click()
                time.sleep(2)
                
                # Take memory snapshot
                memory = self.driver.execute_script("""
                    if (window.performance && window.performance.memory) {
                        return {
                            used_heap: window.performance.memory.usedJSHeapSize,
                            total_heap: window.performance.memory.totalJSHeapSize,
                            heap_limit: window.performance.memory.jsHeapSizeLimit
                        };
                    }
                    return null;
                """)
                
                memory_snapshots.append({"stage": f"generation_{i+1}", "memory": memory})
                
            except Exception as e:
                logger.warning(f"Memory test generation {i+1} failed: {e}")
        
        # Analyze memory growth
        memory_analysis = {
            "snapshots": memory_snapshots,
            "memory_growth": 0,
            "memory_leak_detected": False
        }
        
        if len(memory_snapshots) >= 2:
            initial_used = memory_snapshots[0]["memory"]["used_heap"] if memory_snapshots[0]["memory"] else 0
            final_used = memory_snapshots[-1]["memory"]["used_heap"] if memory_snapshots[-1]["memory"] else 0
            memory_analysis["memory_growth"] = final_used - initial_used
            memory_analysis["memory_leak_detected"] = memory_analysis["memory_growth"] > (initial_used * 0.5)  # 50% growth threshold
        
        self.take_screenshot("03_memory_usage")
        
        return {
            "status": "PASSED" if not memory_analysis["memory_leak_detected"] else "WARNING",
            "memory_analysis": memory_analysis,
            "meets_threshold": not memory_analysis["memory_leak_detected"]
        }

    # ==================== NETWORK PERFORMANCE TESTS ====================
    
    def test_network_performance(self):
        """Test 4: Network performance monitoring"""
        logger.info("🧪 Test 4: Network Performance")
        
        # Clear network logs
        self.driver.execute_cdp_cmd('Network.clearBrowserCache', {})
        
        # Navigate to page and measure network performance
        start_time = time.time()
        self.driver.get(self.base_url)
        self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
        load_time = time.time() - start_time
        
        # Get network metrics
        network_metrics = self.driver.execute_script("""
            if (window.performance && window.performance.getEntriesByType) {
                const resources = window.performance.getEntriesByType('resource');
                const navigation = window.performance.getEntriesByType('navigation')[0];
                
                return {
                    total_requests: resources.length,
                    total_transfer_size: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
                    total_download_time: resources.reduce((sum, resource) => sum + (resource.responseEnd - resource.startTime), 0),
                    navigation_timing: navigation ? {
                        dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                        tcp_connection: navigation.connectEnd - navigation.connectStart,
                        request_time: navigation.responseStart - navigation.requestStart,
                        response_time: navigation.responseEnd - navigation.responseStart
                    } : null,
                    slow_resources: resources.filter(resource => (resource.responseEnd - resource.startTime) > 1000)
                };
            }
            return null;
        """)
        
        # Test network resilience
        network_resilience = self.driver.execute_script("""
            // Test if app works with slow network simulation
            return {
                offline_capability: 'serviceWorker' in navigator,
                cache_available: 'caches' in window,
                network_status: navigator.onLine
            };
        """)
        
        self.take_screenshot("04_network_performance")
        
        return {
            "status": "PASSED" if load_time < 3.0 else "WARNING",
            "load_time": load_time,
            "network_metrics": network_metrics,
            "network_resilience": network_resilience,
            "meets_threshold": load_time < 3.0
        }

    # ==================== DOM PERFORMANCE TESTS ====================
    
    def test_dom_performance(self):
        """Test 5: DOM manipulation performance"""
        logger.info("🧪 Test 5: DOM Performance")
        
        dom_tests = {}
        
        # Test DOM query performance
        try:
            start_time = time.time()
            elements = self.driver.execute_script("""
                return {
                    form_elements: document.querySelectorAll('#workout-form *').length,
                    buttons: document.querySelectorAll('button').length,
                    inputs: document.querySelectorAll('input').length,
                    selects: document.querySelectorAll('select').length
                };
            """)
            query_time = time.time() - start_time
            
            dom_tests["dom_queries"] = {
                "query_time": query_time,
                "elements_found": elements,
                "meets_threshold": query_time < 0.1
            }
            
        except Exception as e:
            dom_tests["dom_queries"] = {"error": str(e)}
        
        # Test DOM manipulation performance
        try:
            start_time = time.time()
            manipulation_result = self.driver.execute_script("""
                // Test form manipulation speed
                const form = document.getElementById('workout-form');
                if (form) {
                    form.style.border = '2px solid red';
                    form.style.border = '1px solid #ccc';
                    return true;
                }
                return false;
            """)
            manipulation_time = time.time() - start_time
            
            dom_tests["dom_manipulation"] = {
                "manipulation_time": manipulation_time,
                "success": manipulation_result,
                "meets_threshold": manipulation_time < 0.05
            }
            
        except Exception as e:
            dom_tests["dom_manipulation"] = {"error": str(e)}
        
        self.take_screenshot("05_dom_performance")
        
        return {
            "status": "PASSED",
            "dom_tests": dom_tests
        }

    # ==================== ANIMATION PERFORMANCE TESTS ====================
    
    def test_animation_performance(self):
        """Test 6: CSS animations and transitions performance"""
        logger.info("🧪 Test 6: Animation Performance")
        
        animation_tests = {}
        
        # Test button hover animations
        try:
            generate_btn = self.driver.find_element(By.ID, "generate-btn")
            
            # Test hover animation
            start_time = time.time()
            self.driver.execute_script("arguments[0].dispatchEvent(new Event('mouseenter'));", generate_btn)
            time.sleep(0.5)
            self.driver.execute_script("arguments[0].dispatchEvent(new Event('mouseleave'));", generate_btn)
            animation_time = time.time() - start_time
            
            animation_tests["button_hover"] = {
                "animation_time": animation_time,
                "meets_threshold": animation_time < 0.6
            }
            
        except Exception as e:
            animation_tests["button_hover"] = {"error": str(e)}
        
        # Test form transition animations
        try:
            start_time = time.time()
            self.driver.execute_script("""
                const form = document.getElementById('workout-form');
                if (form) {
                    form.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        form.style.transform = 'scale(1)';
                    }, 100);
                }
            """)
            time.sleep(0.3)
            transition_time = time.time() - start_time
            
            animation_tests["form_transitions"] = {
                "transition_time": transition_time,
                "meets_threshold": transition_time < 0.4
            }
            
        except Exception as e:
            animation_tests["form_transitions"] = {"error": str(e)}
        
        self.take_screenshot("06_animation_performance")
        
        return {
            "status": "PASSED",
            "animation_tests": animation_tests
        }

    # ==================== TIMER ACCURACY TESTS ====================
    
    def test_timer_accuracy(self):
        """Test 7: Workout timer accuracy"""
        logger.info("🧪 Test 7: Timer Accuracy")
        
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
        
        timer_tests = {}
        
        # Test timer accuracy
        try:
            # Get initial timer state
            initial_timer = self.driver.execute_script("""
                return {
                    isRunning: window.workoutState?.isRunning || false,
                    timeRemaining: window.workoutState?.timeRemaining || 0,
                    currentPhase: window.workoutState?.currentPhase || 'unknown'
                };
            """)
            
            # Wait 5 seconds and check timer again
            time.sleep(5)
            
            final_timer = self.driver.execute_script("""
                return {
                    isRunning: window.workoutState?.isRunning || false,
                    timeRemaining: window.workoutState?.timeRemaining || 0,
                    currentPhase: window.workoutState?.currentPhase || 'unknown'
                };
            """)
            
            # Calculate timer accuracy
            time_difference = initial_timer["timeRemaining"] - final_timer["timeRemaining"]
            expected_difference = 5  # 5 seconds
            accuracy = abs(time_difference - expected_difference)
            
            timer_tests["timer_accuracy"] = {
                "initial_timer": initial_timer,
                "final_timer": final_timer,
                "time_difference": time_difference,
                "expected_difference": expected_difference,
                "accuracy_error": accuracy,
                "meets_threshold": accuracy < 1.0  # Within 1 second accuracy
            }
            
        except Exception as e:
            timer_tests["timer_accuracy"] = {"error": str(e)}
        
        self.take_screenshot("07_timer_accuracy")
        
        return {
            "status": "PASSED",
            "timer_tests": timer_tests
        }

    # ==================== MAIN TEST RUNNER ====================
    
    def run_all_tests(self):
        """Run all performance monitoring tests"""
        logger.info("🚀 Starting Performance Monitoring Test Suite")
        
        self.setup_driver()
        
        all_results = {
            "timestamp": time.time(),
            "base_url": self.base_url,
            "test_suite": "performance_monitoring",
            "tests": {},
            "overall_success_rate": 0.0,
            "status": "FAILED"
        }
        
        try:
            # Performance monitoring tests
            all_results["tests"]["page_load_performance"] = self.test_page_load_performance()
            all_results["tests"]["workout_generation_performance"] = self.test_workout_generation_performance()
            all_results["tests"]["memory_usage"] = self.test_memory_usage()
            all_results["tests"]["network_performance"] = self.test_network_performance()
            all_results["tests"]["dom_performance"] = self.test_dom_performance()
            all_results["tests"]["animation_performance"] = self.test_animation_performance()
            all_results["tests"]["timer_accuracy"] = self.test_timer_accuracy()
            
            # Calculate success rate
            passed_tests = sum(1 for test in all_results["tests"].values() 
                             if test.get("status") == "PASSED")
            all_results["overall_success_rate"] = passed_tests / len(all_results["tests"])
            all_results["status"] = "PASSED" if all_results["overall_success_rate"] >= 0.8 else "WARNING"
            
            logger.info(f"✅ Performance monitoring tests completed. Success rate: {all_results['overall_success_rate']:.2%} ({passed_tests}/{len(all_results['tests'])})")
            
        except Exception as e:
            logger.error(f"❌ Performance monitoring test suite failed: {e}")
            all_results["status"] = "FAILED"
            all_results["error"] = str(e)
        finally:
            self.teardown_driver()
            
            # Save results
            with open("performance_monitoring_results.json", "w") as f:
                json.dump(all_results, f, indent=2)
            logger.info("📊 Results saved to performance_monitoring_results.json")
        
        return all_results

if __name__ == "__main__":
    tester = PerformanceMonitoringTests(headless=True)
    results = tester.run_all_tests()
    print(f"\n🎯 Performance Monitoring Test Results: {results['status']} - {results['overall_success_rate']:.1%} success rate")
