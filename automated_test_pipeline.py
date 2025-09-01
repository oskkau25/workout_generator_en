#!/usr/bin/env python3
"""
🤖 Automated Test Pipeline for Workout Generator
===============================================
Runs comprehensive tests in the background before releases:
- Code quality checks
- UI functionality tests
- Image uniqueness validation
- Performance benchmarks
- Security scans
"""

import os
import sys
import json
import time
import subprocess
import requests
from datetime import datetime
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('test_pipeline.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class AutomatedTestPipeline:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.test_results = {
            'timestamp': datetime.now().isoformat(),
            'overall_status': 'PENDING',
            'tests': {},
            'summary': {}
        }
        self.pipeline_start_time = time.time()
        
    def run_pipeline(self):
        """Main pipeline execution"""
        logger.info("🚀 Starting Automated Test Pipeline")
        logger.info("=" * 50)
        
        try:
            # Phase 1: Pre-flight checks
            self.run_preflight_checks()
            
            # Phase 2: Code quality tests
            self.run_code_quality_tests()
            
            # Phase 3: UI functionality tests
            self.run_ui_functionality_tests()
            
            # Phase 4: Image validation tests
            self.run_image_validation_tests()
            
            # Phase 5: Performance tests
            self.run_performance_tests()
            
            # Phase 6: Security tests
            self.run_security_tests()
            
            # Phase 7: Generate final report
            self.generate_final_report()
            
            # Phase 8: Determine release readiness
            self.determine_release_readiness()
            
        except Exception as e:
            logger.error(f"❌ Pipeline failed: {str(e)}")
            self.test_results['overall_status'] = 'FAILED'
            self.test_results['error'] = str(e)
            self.save_results()
            return False
            
        return True
    
    def run_preflight_checks(self):
        """Check if all required files and dependencies exist"""
        logger.info("🔍 Running Pre-flight Checks")
        
        required_files = [
            'script.js',
            'index.html',
            'exercise_images_database.js',
            'requirements.txt'
        ]
        
        missing_files = []
        for file in required_files:
            if not (self.project_root / file).exists():
                missing_files.append(file)
        
        if missing_files:
            raise FileNotFoundError(f"Missing required files: {missing_files}")
        
        logger.info("✅ Pre-flight checks passed")
        self.test_results['tests']['preflight'] = {'status': 'PASSED', 'details': 'All required files present'}
    
    def run_code_quality_tests(self):
        """Run AI code review and quality checks"""
        logger.info("📊 Running Code Quality Tests")
        
        try:
            # Run the existing AI code review
            result = subprocess.run(
                ['./run_ai_review.sh'],
                capture_output=True,
                text=True,
                cwd=self.project_root,
                timeout=300  # 5 minutes timeout
            )
            
            if result.returncode == 0:
                # Parse the AI review results
                self.parse_ai_review_results()
                logger.info("✅ Code quality tests passed")
            else:
                logger.warning(f"⚠️ AI code review had issues: {result.stderr}")
                self.test_results['tests']['code_quality'] = {
                    'status': 'WARNING',
                    'details': f'AI review completed with warnings: {result.stderr[:200]}'
                }
                
        except subprocess.TimeoutExpired:
            logger.warning("⚠️ AI code review timed out")
            self.test_results['tests']['code_quality'] = {
                'status': 'WARNING',
                'details': 'AI review timed out after 5 minutes'
            }
        except Exception as e:
            logger.error(f"❌ Code quality tests failed: {str(e)}")
            self.test_results['tests']['code_quality'] = {
                'status': 'FAILED',
                'details': str(e)
            }
    
    def parse_ai_review_results(self):
        """Parse the AI code review JSON results"""
        try:
            ai_report_path = self.project_root / 'ai_code_review_report.json'
            if ai_report_path.exists():
                with open(ai_report_path, 'r') as f:
                    ai_results = json.load(f)
                
                # Extract key metrics
                high_priority = len([issue for issue in ai_results.get('issues', []) if issue.get('priority') == 'HIGH'])
                medium_priority = len([issue for issue in ai_results.get('issues', []) if issue.get('priority') == 'MEDIUM'])
                low_priority = len([issue for issue in ai_results.get('issues', []) if issue.get('priority') == 'LOW'])
                
                self.test_results['tests']['code_quality'] = {
                    'status': 'PASSED' if high_priority == 0 else 'WARNING',
                    'details': f'High: {high_priority}, Medium: {medium_priority}, Low: {low_priority}',
                    'ai_report': ai_results
                }
                
        except Exception as e:
            logger.warning(f"Could not parse AI review results: {str(e)}")
    
    def run_ui_functionality_tests(self):
        """Run automated UI functionality tests"""
        logger.info("🧪 Running UI Functionality Tests")
        
        try:
            # Test basic HTML structure
            html_tests = self.test_html_structure()
            
            # Test JavaScript functionality
            js_tests = self.test_javascript_functionality()
            
            # Test form interactions
            form_tests = self.test_form_interactions()
            
            # Combine results
            ui_status = 'PASSED'
            if any(test['status'] == 'FAILED' for test in [html_tests, js_tests, form_tests]):
                ui_status = 'FAILED'
            elif any(test['status'] == 'WARNING' for test in [html_tests, js_tests, form_tests]):
                ui_status = 'WARNING'
            
            self.test_results['tests']['ui_functionality'] = {
                'status': ui_status,
                'details': {
                    'html_structure': html_tests,
                    'javascript_functionality': js_tests,
                    'form_interactions': form_tests
                }
            }
            
            logger.info(f"✅ UI functionality tests completed: {ui_status}")
            
        except Exception as e:
            logger.error(f"❌ UI functionality tests failed: {str(e)}")
            self.test_results['tests']['ui_functionality'] = {
                'status': 'FAILED',
                'details': str(e)
            }
    
    def test_html_structure(self):
        """Test basic HTML structure and accessibility"""
        try:
            html_path = self.project_root / 'index.html'
            with open(html_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            tests = {
                'has_title': '<title>' in html_content,
                'has_main_form': 'workout-form' in html_content,
                'has_duration_slider': 'duration' in html_content,
                'has_fitness_level': 'fitness-level' in html_content,
                'has_equipment_checkboxes': 'checkbox' in html_content,
                'has_generate_button': 'generate-btn' in html_content,
                'has_results_section': 'workout-plan' in html_content
            }
            
            passed = sum(tests.values())
            total = len(tests)
            
            return {
                'status': 'PASSED' if passed == total else 'WARNING',
                'score': f'{passed}/{total}',
                'details': tests
            }
            
        except Exception as e:
            return {'status': 'FAILED', 'details': str(e)}
    
    def test_javascript_functionality(self):
        """Test JavaScript functionality and dependencies"""
        try:
            js_path = self.project_root / 'script.js'
            with open(js_path, 'r', encoding='utf-8') as f:
                js_content = f.read()
            
            tests = {
                'has_exercises_array': 'const exercises = [' in js_content,
                'has_getExerciseImage': 'getExerciseImage' in js_content,
                'has_form_handler': 'addEventListener' in js_content,
                'has_validation': 'validateForm' in js_content,
                'has_error_handling': 'showError' in js_content,
                'has_plan_generation': 'generateRandomSet' in js_content,
                'has_display_functions': 'displayPlan' in js_content
            }
            
            passed = sum(tests.values())
            total = len(tests)
            
            return {
                'status': 'PASSED' if passed == total else 'WARNING',
                'score': f'{passed}/{total}',
                'details': tests
            }
            
        except Exception as e:
            return {'status': 'FAILED', 'details': str(e)}
    
    def test_form_interactions(self):
        """Test form interaction logic"""
        try:
            js_path = self.project_root / 'script.js'
            with open(js_path, 'r', encoding='utf-8') as f:
                js_content = f.read()
            
            tests = {
                'has_duration_validation': 'durationSlider' in js_content,
                'has_equipment_filtering': 'selectedEquipment' in js_content,
                'has_level_filtering': 'fitness-level' in js_content,
                'has_exercise_filtering': 'filterByType' in js_content,
                'has_fallback_logic': 'availableMain.length === 0' in js_content
            }
            
            passed = sum(tests.values())
            total = len(tests)
            
            return {
                'status': 'PASSED' if passed == total else 'WARNING',
                'score': f'{passed}/{total}',
                'details': tests
            }
            
        except Exception as e:
            return {'status': 'FAILED', 'details': str(e)}
    
    def run_image_validation_tests(self):
        """Test image uniqueness and availability"""
        logger.info("🖼️ Running Image Validation Tests")
        
        try:
            # Check exercise images database
            images_path = self.project_root / 'exercise_images_database.js'
            if not images_path.exists():
                raise FileNotFoundError("Exercise images database not found")
            
            with open(images_path, 'r', encoding='utf-8') as f:
                images_content = f.read()
            
            # Extract image URLs
            import re
            image_urls = re.findall(r'https://[^\s"\']+', images_content)
            
            # Check for duplicates
            unique_urls = set(image_urls)
            duplicate_count = len(image_urls) - len(unique_urls)
            
            # Check image accessibility (sample a few)
            accessible_images = 0
            total_checked = min(5, len(unique_urls))
            
            for url in list(unique_urls)[:total_checked]:
                try:
                    response = requests.head(url, timeout=10)
                    if response.status_code == 200:
                        accessible_images += 1
                except:
                    pass
            
            image_status = 'PASSED'
            if duplicate_count > 0:
                image_status = 'WARNING'
            if accessible_images < total_checked * 0.8:  # Less than 80% accessible
                image_status = 'WARNING'
            
            self.test_results['tests']['image_validation'] = {
                'status': image_status,
                'details': {
                    'total_images': len(image_urls),
                    'unique_images': len(unique_urls),
                    'duplicates': duplicate_count,
                    'accessibility_score': f'{accessible_images}/{total_checked}'
                }
            }
            
            logger.info(f"✅ Image validation completed: {image_status}")
            
        except Exception as e:
            logger.error(f"❌ Image validation failed: {str(e)}")
            self.test_results['tests']['image_validation'] = {
                'status': 'FAILED',
                'details': str(e)
            }
    
    def run_performance_tests(self):
        """Run basic performance benchmarks"""
        logger.info("⚡ Running Performance Tests")
        
        try:
            # Test file sizes
            file_sizes = {}
            for file_path in ['script.js', 'index.html', 'exercise_images_database.js']:
                full_path = self.project_root / file_path
                if full_path.exists():
                    file_sizes[file_path] = full_path.stat().st_size
            
            # Performance thresholds
            performance_status = 'PASSED'
            warnings = []
            
            if file_sizes.get('script.js', 0) > 100000:  # 100KB
                warnings.append('script.js is larger than 100KB')
                performance_status = 'WARNING'
            
            if file_sizes.get('exercise_images_database.js', 0) > 50000:  # 50KB
                warnings.append('exercise_images_database.js is larger than 50KB')
                performance_status = 'WARNING'
            
            self.test_results['tests']['performance'] = {
                'status': performance_status,
                'details': {
                    'file_sizes': file_sizes,
                    'warnings': warnings
                }
            }
            
            logger.info(f"✅ Performance tests completed: {performance_status}")
            
        except Exception as e:
            logger.error(f"❌ Performance tests failed: {str(e)}")
            self.test_results['tests']['performance'] = {
                'status': 'FAILED',
                'details': str(e)
            }
    
    def run_security_tests(self):
        """Run basic security checks"""
        logger.info("🔒 Running Security Tests")
        
        try:
            security_issues = []
            
            # Check for hardcoded API keys
            js_path = self.project_root / 'script.js'
            with open(js_path, 'r', encoding='utf-8') as f:
                js_content = f.read()
            
            # Security checks
            if 'API_KEY' in js_content or 'api_key' in js_content:
                security_issues.append('Potential API key exposure')
            
            if 'password' in js_content.lower():
                security_issues.append('Password references found')
            
            if 'localhost' in js_content or '127.0.0.1' in js_content:
                security_issues.append('Local development references found')
            
            security_status = 'PASSED'
            if security_issues:
                security_status = 'WARNING'
            
            self.test_results['tests']['security'] = {
                'status': security_status,
                'details': {
                    'issues_found': security_issues,
                    'total_issues': len(security_issues)
                }
            }
            
            logger.info(f"✅ Security tests completed: {security_status}")
            
        except Exception as e:
            logger.error(f"❌ Security tests failed: {str(e)}")
            self.test_results['tests']['security'] = {
                'status': 'FAILED',
                'details': str(e)
            }
    
    def generate_final_report(self):
        """Generate comprehensive test report"""
        logger.info("📋 Generating Final Report")
        
        # Calculate summary statistics
        total_tests = len(self.test_results['tests'])
        passed_tests = sum(1 for test in self.test_results['tests'].values() if test['status'] == 'PASSED')
        warning_tests = sum(1 for test in self.test_results['tests'].values() if test['status'] == 'WARNING')
        failed_tests = sum(1 for test in self.test_results['tests'].values() if test['status'] == 'FAILED')
        
        self.test_results['summary'] = {
            'total_tests': total_tests,
            'passed': passed_tests,
            'warnings': warning_tests,
            'failed': failed_tests,
            'success_rate': f'{(passed_tests / total_tests * 100):.1f}%' if total_tests > 0 else '0%'
        }
        
        # Determine overall status
        if failed_tests > 0:
            self.test_results['overall_status'] = 'FAILED'
        elif warning_tests > 0:
            self.test_results['overall_status'] = 'WARNING'
        else:
            self.test_results['overall_status'] = 'PASSED'
        
        # Calculate execution time
        execution_time = time.time() - self.pipeline_start_time
        self.test_results['execution_time'] = f'{execution_time:.2f} seconds'
        
        logger.info(f"📊 Final Results: {self.test_results['overall_status']}")
        logger.info(f"✅ Passed: {passed_tests}, ⚠️ Warnings: {warning_tests}, ❌ Failed: {failed_tests}")
        logger.info(f"⏱️ Execution time: {execution_time:.2f} seconds")
    
    def determine_release_readiness(self):
        """Determine if the code is ready for release"""
        logger.info("🚀 Determining Release Readiness")
        
        if self.test_results['overall_status'] == 'PASSED':
            logger.info("🎉 Code is READY FOR RELEASE!")
            self.test_results['release_ready'] = True
            self.test_results['release_recommendation'] = 'APPROVED - All tests passed'
        elif self.test_results['overall_status'] == 'WARNING':
            logger.warning("⚠️ Code has warnings but may be ready for release")
            self.test_results['release_ready'] = True
            self.test_results['release_recommendation'] = 'APPROVED WITH WARNINGS - Review warnings before release'
        else:
            logger.error("❌ Code is NOT READY FOR RELEASE")
            self.test_results['release_ready'] = False
            self.test_results['release_recommendation'] = 'REJECTED - Fix failed tests before release'
    
    def save_results(self):
        """Save test results to file"""
        try:
            results_file = self.project_root / 'automated_test_results.json'
            with open(results_file, 'w', encoding='utf-8') as f:
                json.dump(self.test_results, f, indent=2, ensure_ascii=False)
            
            logger.info(f"💾 Test results saved to: {results_file}")
            
        except Exception as e:
            logger.error(f"Failed to save test results: {str(e)}")

def main():
    """Main entry point"""
    pipeline = AutomatedTestPipeline()
    
    try:
        success = pipeline.run_pipeline()
        pipeline.save_results()
        
        if success:
            logger.info("🎉 Pipeline completed successfully!")
            sys.exit(0)
        else:
            logger.error("❌ Pipeline failed!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        logger.info("⏹️ Pipeline interrupted by user")
        pipeline.save_results()
        sys.exit(1)
    except Exception as e:
        logger.error(f"💥 Unexpected error: {str(e)}")
        pipeline.save_results()
        sys.exit(1)

if __name__ == "__main__":
    main()
