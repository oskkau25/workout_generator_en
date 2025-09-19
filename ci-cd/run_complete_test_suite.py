#!/usr/bin/env python3
"""
🚀 Complete Test Suite Runner for Workout Generator
=================================================
Runs all test suites for comprehensive coverage
"""

import json
import logging
import time
import os
import sys
from pathlib import Path

# Add the project root to the path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Import all test suites
from user_interaction_tests import UserInteractionTests
from responsive_design_tests import ResponsiveDesignTests
from performance_monitoring_tests import PerformanceMonitoringTests
from security_validation_tests import SecurityValidationTests
from accessibility_compliance_tests import AccessibilityComplianceTests

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CompleteTestSuiteRunner:
    def __init__(self, base_url="http://127.0.0.1:8001", headless=True):
        self.base_url = base_url
        self.headless = headless
        self.results = {}
        
    def run_all_test_suites(self):
        """Run all test suites and compile results"""
        logger.info("🚀 Starting Complete Test Suite Runner")
        logger.info("=" * 60)
        
        start_time = time.time()
        
        # Test suite configurations
        test_suites = [
            {
                "name": "User Interaction Tests",
                "class": UserInteractionTests,
                "description": "Complex user workflows and interactions"
            },
            {
                "name": "Responsive Design Tests", 
                "class": ResponsiveDesignTests,
                "description": "Multi-device compatibility and responsive design"
            },
            {
                "name": "Performance Monitoring Tests",
                "class": PerformanceMonitoringTests,
                "description": "Performance metrics and monitoring"
            },
            {
                "name": "Security Validation Tests",
                "class": SecurityValidationTests,
                "description": "Security testing and validation"
            },
            {
                "name": "Accessibility Compliance Tests",
                "class": AccessibilityComplianceTests,
                "description": "WCAG 2.1 compliance and accessibility"
            }
        ]
        
        suite_results = {}
        
        for suite_config in test_suites:
            logger.info(f"🧪 Running {suite_config['name']}")
            logger.info(f"   Description: {suite_config['description']}")
            
            try:
                # Initialize and run test suite
                suite_runner = suite_config["class"](self.base_url, self.headless)
                suite_result = suite_runner.run_all_tests()
                
                suite_results[suite_config["name"]] = {
                    "status": suite_result.get("status", "UNKNOWN"),
                    "success_rate": suite_result.get("overall_success_rate", 0.0),
                    "total_tests": len(suite_result.get("tests", {})),
                    "passed_tests": sum(1 for test in suite_result.get("tests", {}).values() 
                                       if test.get("status") == "PASSED"),
                    "description": suite_config["description"],
                    "details": suite_result
                }
                
                logger.info(f"   ✅ {suite_config['name']} completed: {suite_result.get('status', 'UNKNOWN')} - {suite_result.get('overall_success_rate', 0.0):.1%} success rate")
                
            except Exception as e:
                logger.error(f"   ❌ {suite_config['name']} failed: {e}")
                suite_results[suite_config["name"]] = {
                    "status": "FAILED",
                    "success_rate": 0.0,
                    "total_tests": 0,
                    "passed_tests": 0,
                    "description": suite_config["description"],
                    "error": str(e)
                }
            
            logger.info("")
        
        # Calculate overall statistics
        total_tests = sum(result["total_tests"] for result in suite_results.values())
        total_passed = sum(result["passed_tests"] for result in suite_results.values())
        overall_success_rate = total_passed / total_tests if total_tests > 0 else 0.0
        
        # Determine overall status
        if overall_success_rate >= 0.9:
            overall_status = "EXCELLENT"
        elif overall_success_rate >= 0.8:
            overall_status = "PASSED"
        elif overall_success_rate >= 0.7:
            overall_status = "WARNING"
        else:
            overall_status = "FAILED"
        
        execution_time = time.time() - start_time
        
        # Compile final results
        final_results = {
            "timestamp": time.time(),
            "execution_time": execution_time,
            "base_url": self.base_url,
            "overall_status": overall_status,
            "overall_success_rate": overall_success_rate,
            "total_tests": total_tests,
            "total_passed": total_passed,
            "total_failed": total_tests - total_passed,
            "test_suites": suite_results,
            "summary": {
                "user_interaction_tests": suite_results.get("User Interaction Tests", {}).get("status", "NOT_RUN"),
                "responsive_design_tests": suite_results.get("Responsive Design Tests", {}).get("status", "NOT_RUN"),
                "performance_monitoring_tests": suite_results.get("Performance Monitoring Tests", {}).get("status", "NOT_RUN"),
                "security_validation_tests": suite_results.get("Security Validation Tests", {}).get("status", "NOT_RUN"),
                "accessibility_compliance_tests": suite_results.get("Accessibility Compliance Tests", {}).get("status", "NOT_RUN")
            }
        }
        
        # Save results
        with open("complete_test_suite_results.json", "w") as f:
            json.dump(final_results, f, indent=2)
        
        # Print summary
        logger.info("=" * 60)
        logger.info("🎯 COMPLETE TEST SUITE RESULTS")
        logger.info("=" * 60)
        logger.info(f"Overall Status: {overall_status}")
        logger.info(f"Overall Success Rate: {overall_success_rate:.1%}")
        logger.info(f"Total Tests: {total_tests}")
        logger.info(f"Passed Tests: {total_passed}")
        logger.info(f"Failed Tests: {total_tests - total_passed}")
        logger.info(f"Execution Time: {execution_time:.2f} seconds")
        logger.info("")
        
        logger.info("📊 Test Suite Breakdown:")
        for suite_name, result in suite_results.items():
            status_emoji = "✅" if result["status"] == "PASSED" else "⚠️" if result["status"] == "WARNING" else "❌"
            logger.info(f"   {status_emoji} {suite_name}: {result['status']} - {result['success_rate']:.1%} ({result['passed_tests']}/{result['total_tests']})")
        
        logger.info("")
        logger.info("📁 Results saved to: complete_test_suite_results.json")
        logger.info("=" * 60)
        
        return final_results

def main():
    """Main function to run the complete test suite"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Run complete test suite for workout generator")
    parser.add_argument("--url", default="http://127.0.0.1:8001", help="Base URL for testing")
    parser.add_argument("--headless", action="store_true", default=True, help="Run tests in headless mode")
    parser.add_argument("--visible", action="store_true", help="Run tests with visible browser")
    
    args = parser.parse_args()
    
    # Override headless if visible is specified
    headless = not args.visible
    
    # Run complete test suite
    runner = CompleteTestSuiteRunner(args.url, headless)
    results = runner.run_all_test_suites()
    
    # Exit with appropriate code
    if results["overall_status"] in ["EXCELLENT", "PASSED"]:
        sys.exit(0)
    elif results["overall_status"] == "WARNING":
        sys.exit(1)
    else:
        sys.exit(2)

if __name__ == "__main__":
    main()
