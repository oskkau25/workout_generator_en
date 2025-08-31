/**
 * Comprehensive UI Test Suite for Workout Generator
 * Tests all functionality, edge cases, and user interactions
 */

class WorkoutGeneratorUITestSuite {
    constructor() {
        this.testResults = [];
        this.currentTest = '';
        this.passedTests = 0;
        this.failedTests = 0;
        this.totalTests = 0;
    }

    // Test logging and reporting
    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
        console.log(logMessage);
        
        if (type === 'error') {
            this.testResults.push({ test: this.currentTest, status: 'FAILED', message, timestamp });
            this.failedTests++;
        } else if (type === 'success') {
            this.testResults.push({ test: this.currentTest, status: 'PASSED', message, timestamp });
            this.passedTests++;
        }
        this.totalTests++;
    }

    // Utility functions
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getElement(selector) {
        return document.querySelector(selector);
    }

    getAllElements(selector) {
        return document.querySelectorAll(selector);
    }

    clickElement(selector) {
        const element = this.getElement(selector);
        if (element) {
            element.click();
            return true;
        }
        return false;
    }

    setValue(selector, value) {
        const element = this.getElement(selector);
        if (element) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }
        return false;
    }

    checkElementExists(selector) {
        return this.getElement(selector) !== null;
    }

    checkElementText(selector, expectedText) {
        const element = this.getElement(selector);
        return element && element.textContent.includes(expectedText);
    }

    // Test Categories

    // 1. Page Load and Initial State Tests
    async testPageLoad() {
        this.currentTest = 'Page Load Test';
        this.log('Starting page load test...');

        // Check if main elements exist
        const requiredElements = [
            '#workout-form',
            '#fitness-level',
            '#duration',
            '#duration-value',
            '#generate-btn',
            '#workout-plan',
            '#loading',
            '#no-results'
        ];

        for (const selector of requiredElements) {
            if (!this.checkElementExists(selector)) {
                this.log(`Missing required element: ${selector}`, 'error');
                return false;
            }
        }

        // Check initial state
        if (this.getElement('#duration-value').textContent !== '30') {
            this.log('Duration value should be 30 by default', 'error');
            return false;
        }

        if (this.getElement('#fitness-level').value !== 'Beginner') {
            this.log('Fitness level should be Beginner by default', 'error');
            return false;
        }

        // Check if Bodyweight is selected by default
        const bodyweightCheckbox = this.getElement('#eq-bodyweight');
        if (!bodyweightCheckbox.checked) {
            this.log('Bodyweight should be selected by default', 'error');
            return false;
        }

        this.log('Page load test completed successfully', 'success');
        return true;
    }

    // 2. Form Interaction Tests
    async testFormInteractions() {
        this.currentTest = 'Form Interactions Test';
        this.log('Starting form interactions test...');

        // Test duration slider
        const durationSlider = this.getElement('#duration');
        const durationValue = this.getElement('#duration-value');
        
        // Test different duration values
        const testDurations = [10, 20, 30, 45, 60];
        for (const duration of testDurations) {
            this.setValue('#duration', duration);
            await this.wait(100);
            
            if (durationValue.textContent !== duration.toString()) {
                this.log(`Duration slider not updating correctly. Expected: ${duration}, Got: ${durationValue.textContent}`, 'error');
                return false;
            }
        }

        // Test fitness level selection
        const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];
        for (const level of fitnessLevels) {
            this.setValue('#fitness-level', level);
            await this.wait(100);
            
            if (this.getElement('#fitness-level').value !== level) {
                this.log(`Fitness level not updating correctly. Expected: ${level}`, 'error');
                return false;
            }
        }

        // Test equipment selection
        const equipmentOptions = [
            '#eq-dumbbells',
            '#eq-kettlebell',
            '#eq-pullup',
            '#eq-band',
            '#eq-jumprope',
            '#eq-trx',
            '#eq-rower',
            '#eq-foamroller'
        ];

        for (const selector of equipmentOptions) {
            const checkbox = this.getElement(selector);
            const originalState = checkbox.checked;
            
            // Toggle checkbox
            this.clickElement(selector);
            await this.wait(100);
            
            if (checkbox.checked === originalState) {
                this.log(`Equipment checkbox ${selector} not toggling correctly`, 'error');
                return false;
            }
            
            // Toggle back
            this.clickElement(selector);
            await this.wait(100);
        }

        this.log('Form interactions test completed successfully', 'success');
        return true;
    }

    // 3. Workout Generation Tests
    async testWorkoutGeneration() {
        this.currentTest = 'Workout Generation Test';
        this.log('Starting workout generation test...');

        // Test 1: Bodyweight only workout
        this.log('Testing bodyweight only workout...');
        
        // Reset form
        this.setValue('#fitness-level', 'Beginner');
        this.setValue('#duration', 30);
        
        // Uncheck all equipment except bodyweight
        const equipmentCheckboxes = this.getAllElements('input[type="checkbox"]');
        equipmentCheckboxes.forEach(checkbox => {
            if (checkbox.value !== 'Bodyweight') {
                checkbox.checked = false;
            } else {
                checkbox.checked = true;
            }
        });

        // Submit form
        this.clickElement('#generate-btn');
        await this.wait(2000);

        // Check if workout plan is generated
        if (!this.checkElementExists('#workout-plan:not(.hidden)')) {
            this.log('Workout plan not generated for bodyweight only', 'error');
            return false;
        }

        // Check if exercises are displayed
        const exerciseCards = this.getAllElements('#plan-content .bg-gray-800');
        if (exerciseCards.length === 0) {
            this.log('No exercise cards displayed in workout plan', 'error');
            return false;
        }

        this.log(`Generated ${exerciseCards.length} exercise cards for bodyweight workout`, 'success');

        // Test 2: Multiple equipment workout
        this.log('Testing multiple equipment workout...');
        
        // Select multiple equipment
        this.clickElement('#eq-dumbbells');
        this.clickElement('#eq-kettlebell');
        
        // Submit form
        this.clickElement('#generate-btn');
        await this.wait(2000);

        // Check if workout plan is generated
        if (!this.checkElementExists('#workout-plan:not(.hidden)')) {
            this.log('Workout plan not generated for multiple equipment', 'error');
            return false;
        }

        this.log('Multiple equipment workout test completed successfully', 'success');

        // Test 3: Different fitness levels
        const fitnessLevels = ['Intermediate', 'Advanced'];
        for (const level of fitnessLevels) {
            this.log(`Testing ${level} fitness level...`);
            
            this.setValue('#fitness-level', level);
            this.clickElement('#generate-btn');
            await this.wait(2000);

            if (!this.checkElementExists('#workout-plan:not(.hidden)')) {
                this.log(`Workout plan not generated for ${level} level`, 'error');
                return false;
            }
        }

        this.log('Workout generation test completed successfully', 'success');
        return true;
    }

    // 4. Edge Cases and Error Handling Tests
    async testEdgeCases() {
        this.currentTest = 'Edge Cases Test';
        this.log('Starting edge cases test...');

        // Test 1: No equipment selected (should default to bodyweight)
        this.log('Testing no equipment selected...');
        
        // Uncheck all equipment
        const equipmentCheckboxes = this.getAllElements('input[type="checkbox"]');
        equipmentCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        this.clickElement('#generate-btn');
        await this.wait(2000);

        // Should still generate a workout (bodyweight fallback)
        if (!this.checkElementExists('#workout-plan:not(.hidden)')) {
            this.log('No workout generated when no equipment selected (should fallback to bodyweight)', 'error');
            return false;
        }

        // Test 2: Very short duration
        this.log('Testing very short duration...');
        this.setValue('#duration', 10);
        this.clickElement('#generate-btn');
        await this.wait(2000);

        if (!this.checkElementExists('#workout-plan:not(.hidden)')) {
            this.log('No workout generated for short duration', 'error');
            return false;
        }

        // Test 3: Very long duration
        this.log('Testing very long duration...');
        this.setValue('#duration', 60);
        this.clickElement('#generate-btn');
        await this.wait(2000);

        if (!this.checkElementExists('#workout-plan:not(.hidden)')) {
            this.log('No workout generated for long duration', 'error');
            return false;
        }

        // Test 4: Loading state
        this.log('Testing loading state...');
        this.clickElement('#generate-btn');
        
        // Check if loading indicator appears
        if (!this.checkElementExists('#loading:not(.hidden)')) {
            this.log('Loading indicator not showing', 'error');
            return false;
        }

        await this.wait(2000);

        // Check if loading indicator disappears
        if (this.checkElementExists('#loading:not(.hidden)')) {
            this.log('Loading indicator not hiding after completion', 'error');
            return false;
        }

        this.log('Edge cases test completed successfully', 'success');
        return true;
    }

    // 5. Image Loading Tests
    async testImageLoading() {
        this.currentTest = 'Image Loading Test';
        this.log('Starting image loading test...');

        // Generate a workout to test images
        this.clickElement('#generate-btn');
        await this.wait(2000);

        const exerciseCards = this.getAllElements('#plan-content .bg-gray-800');
        if (exerciseCards.length === 0) {
            this.log('No exercise cards to test images', 'error');
            return false;
        }

        // Check if images are present
        const images = this.getAllElements('#plan-content img');
        if (images.length === 0) {
            this.log('No images found in exercise cards', 'error');
            return false;
        }

        // Check if images have proper alt text
        for (const img of images) {
            if (!img.alt || img.alt === '') {
                this.log('Image missing alt text', 'error');
                return false;
            }
        }

        // Test image error handling (simulate broken image)
        const firstImage = images[0];
        const originalSrc = firstImage.src;
        firstImage.src = 'broken-image-url.jpg';
        firstImage.dispatchEvent(new Event('error'));
        await this.wait(100);

        // Check if fallback image is loaded
        if (firstImage.src === originalSrc) {
            this.log('Image error handling not working properly', 'error');
            return false;
        }

        this.log(`Image loading test completed successfully. Found ${images.length} images`, 'success');
        return true;
    }

    // 6. Responsive Design Tests
    async testResponsiveDesign() {
        this.currentTest = 'Responsive Design Test';
        this.log('Starting responsive design test...');

        // Test different viewport sizes
        const viewports = [
            { width: 375, height: 667, name: 'Mobile' },
            { width: 768, height: 1024, name: 'Tablet' },
            { width: 1024, height: 768, name: 'Desktop' },
            { width: 1920, height: 1080, name: 'Large Desktop' }
        ];

        for (const viewport of viewports) {
            this.log(`Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})...`);
            
            // Simulate viewport change
            window.innerWidth = viewport.width;
            window.innerHeight = viewport.height;
            window.dispatchEvent(new Event('resize'));
            
            await this.wait(100);

            // Check if form is still accessible
            if (!this.checkElementExists('#workout-form')) {
                this.log(`Form not accessible on ${viewport.name} viewport`, 'error');
                return false;
            }

            // Check if generate button is clickable
            if (!this.getElement('#generate-btn').disabled === false) {
                this.log(`Generate button not clickable on ${viewport.name} viewport`, 'error');
                return false;
            }
        }

        this.log('Responsive design test completed successfully', 'success');
        return true;
    }

    // 7. Accessibility Tests
    async testAccessibility() {
        this.currentTest = 'Accessibility Test';
        this.log('Starting accessibility test...');

        // Check for proper form labels
        const formLabels = this.getAllElements('label');
        if (formLabels.length === 0) {
            this.log('No form labels found', 'error');
            return false;
        }

        // Check for proper heading structure
        const headings = this.getAllElements('h1, h2, h3');
        if (headings.length === 0) {
            this.log('No headings found', 'error');
            return false;
        }

        // Check if main heading exists
        if (!this.checkElementText('h1', 'Your AI Workout Plan Generator')) {
            this.log('Main heading not found or incorrect', 'error');
            return false;
        }

        // Check for proper button text
        const generateButton = this.getElement('#generate-btn');
        if (!generateButton.textContent.includes('Create Smart Plan')) {
            this.log('Generate button text not descriptive', 'error');
            return false;
        }

        // Check for proper form structure
        if (!this.checkElementExists('form')) {
            this.log('Form element not found', 'error');
            return false;
        }

        this.log('Accessibility test completed successfully', 'success');
        return true;
    }

    // 8. Performance Tests
    async testPerformance() {
        this.currentTest = 'Performance Test';
        this.log('Starting performance test...');

        const startTime = performance.now();

        // Generate multiple workouts to test performance
        for (let i = 0; i < 3; i++) {
            this.clickElement('#generate-btn');
            await this.wait(2000);
        }

        const endTime = performance.now();
        const totalTime = endTime - startTime;

        if (totalTime > 10000) { // 10 seconds threshold
            this.log(`Performance test failed: ${totalTime}ms (should be under 10 seconds)`, 'error');
            return false;
        }

        this.log(`Performance test completed in ${totalTime.toFixed(2)}ms`, 'success');
        return true;
    }

    // Main test runner
    async runAllTests() {
        this.log('🚀 Starting Comprehensive UI Test Suite for Workout Generator', 'info');
        this.log('=' * 60, 'info');

        const tests = [
            this.testPageLoad.bind(this),
            this.testFormInteractions.bind(this),
            this.testWorkoutGeneration.bind(this),
            this.testEdgeCases.bind(this),
            this.testImageLoading.bind(this),
            this.testResponsiveDesign.bind(this),
            this.testAccessibility.bind(this),
            this.testPerformance.bind(this)
        ];

        for (const test of tests) {
            try {
                await test();
            } catch (error) {
                this.log(`Test failed with error: ${error.message}`, 'error');
            }
        }

        this.generateReport();
    }

    // Generate test report
    generateReport() {
        this.log('=' * 60, 'info');
        this.log('📊 UI TEST SUITE RESULTS', 'info');
        this.log('=' * 60, 'info');
        this.log(`Total Tests: ${this.totalTests}`, 'info');
        this.log(`Passed: ${this.passedTests}`, 'success');
        this.log(`Failed: ${this.failedTests}`, this.failedTests > 0 ? 'error' : 'success');
        this.log(`Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(2)}%`, 'info');

        if (this.failedTests > 0) {
            this.log('\n❌ FAILED TESTS:', 'error');
            this.testResults
                .filter(result => result.status === 'FAILED')
                .forEach(result => {
                    this.log(`- ${result.test}: ${result.message}`, 'error');
                });
        }

        this.log('\n✅ PASSED TESTS:', 'success');
        this.testResults
            .filter(result => result.status === 'PASSED')
            .forEach(result => {
                this.log(`- ${result.test}: ${result.message}`, 'success');
            });

        // Save detailed report
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.totalTests,
                passed: this.passedTests,
                failed: this.failedTests,
                successRate: ((this.passedTests / this.totalTests) * 100).toFixed(2)
            },
            results: this.testResults
        };

        // Create downloadable report
        const reportBlob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const reportUrl = URL.createObjectURL(reportBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = reportUrl;
        downloadLink.download = 'ui-test-report.json';
        downloadLink.textContent = 'Download Test Report';
        downloadLink.style.cssText = 'display: block; margin: 20px; padding: 10px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; text-align: center;';
        
        document.body.appendChild(downloadLink);

        this.log('\n📄 Detailed test report saved as ui-test-report.json', 'info');
    }
}

// Auto-run tests when page is loaded
document.addEventListener('DOMContentLoaded', () => {
    const testSuite = new WorkoutGeneratorUITestSuite();
    
    // Add test runner button to page
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Run UI Tests';
    testButton.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;';
    testButton.onclick = () => testSuite.runAllTests();
    
    document.body.appendChild(testButton);
    
    console.log('UI Test Suite loaded. Click the "Run UI Tests" button to start testing.');
});
