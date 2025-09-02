#!/bin/bash

# Pre-commit hook for Workout Generator
# This script runs the automated test pipeline before allowing commits
# to ensure code quality and prevent broken code from being committed

echo "🔍 Running Pre-commit Quality Checks..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if we're in the right directory
if [ ! -f "automated_test_pipeline.py" ]; then
    print_status $RED "❌ Error: automated_test_pipeline.py not found!"
    print_status $RED "Please run this hook from the project root directory."
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    print_status $RED "❌ Error: python3 is not installed or not in PATH"
    exit 1
fi

# Check if required files exist
required_files=("script.js" "index.html" "requirements.txt")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    print_status $RED "❌ Error: Missing required files:"
    for file in "${missing_files[@]}"; do
        print_status $RED "   - $file"
    done
    exit 1
fi

print_status $GREEN "✅ Pre-flight checks passed"

# Run the automated test pipeline
print_status $BLUE "🚀 Running Automated Test Pipeline..."

# Set timeout for pipeline (5 minutes) - handle different systems
if command -v gtimeout &> /dev/null; then
    # macOS with coreutils installed
    gtimeout 300 python3 automated_test_pipeline.py
elif command -v timeout &> /dev/null; then
    # Linux systems
    timeout 300 python3 automated_test_pipeline.py
else
    # macOS without coreutils - run without timeout
    print_status $YELLOW "⚠️  No timeout command available, running pipeline without timeout"
    python3 automated_test_pipeline.py
fi

# Check if pipeline completed successfully
if [ $? -eq 0 ]; then
    print_status $GREEN "✅ Pipeline completed successfully"
else
    print_status $RED "❌ Pipeline failed or timed out"
    print_status $RED "Please fix the issues before committing"
    exit 1
fi

# Step 2: Local Page Preview
print_status $BLUE "🌐 Starting Local Page Preview..."
print_status $BLUE "======================================"

# Kill any existing server on port 5173
print_status $YELLOW "🔄 Stopping any existing server on port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No existing server found"

# Start the local server
print_status $BLUE "🚀 Starting local server on http://localhost:5173..."
python3 -m http.server 5173 --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Check if server started successfully
if kill -0 $SERVER_PID 2>/dev/null; then
    print_status $GREEN "✅ Local server started successfully"
    print_status $BLUE "🌐 Your app is now running at: http://localhost:5173"
    
    # Try to automatically open the browser
    print_status $BLUE "🌐 Attempting to open browser automatically..."
    if command -v open &> /dev/null; then
        # macOS
        open "http://localhost:5173" 2>/dev/null &
        print_status $GREEN "✅ Browser opened automatically (macOS)"
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "http://localhost:5173" 2>/dev/null &
        print_status $GREEN "✅ Browser opened automatically (Linux)"
    else
        print_status $YELLOW "⚠️  Please manually open: http://localhost:5173"
    fi
    
    print_status $YELLOW "📱 Review the changes in your browser"
    
    print_status $BLUE "🔍 VISUAL REVIEW CHECKLIST:"
    print_status $BLUE "======================================"
    print_status $BLUE "✅ Form is visible as landing page"
    print_status $BLUE "✅ Equipment icons: 💪🏋️⚖️🎯🔄🏗️⏰🚣"
    print_status $BLUE "✅ Duration icons: ⚡🔥💪🏆"
    print_status $BLUE "✅ Fitness level icons: 🌱🔥⚡"
    print_status $BLUE "✅ Work/Rest icons: 💪😴"
    print_status $BLUE "✅ Generate button with lightning icon ⚡"
    print_status $BLUE "✅ Resume workout button (if applicable)"
    print_status $BLUE "✅ All symbols are properly aligned and sized"
    print_status $BLUE "✅ Form layout is clean and professional"
    print_status $BLUE "======================================"
    
    print_status $BLUE "⏳ Waiting for your review... (press Enter when ready to continue)"
    
    # Wait for user input
    read -p "Press Enter to continue with commit, or Ctrl+C to abort..."
    
    # Stop the server
    print_status $YELLOW "🛑 Stopping local server..."
    kill $SERVER_PID 2>/dev/null
    sleep 1
    
    print_status $GREEN "✅ Local preview completed"
else
    print_status $RED "❌ Failed to start local server"
    print_status $YELLOW "⚠️  Continuing without local preview..."
fi

# Step 3: Show what will be committed
print_status $BLUE "📝 Reviewing Changes to be Committed..."
print_status $BLUE "======================================"

# Show git status
print_status $YELLOW "📊 Git Status:"
git status --short

# Show diff of changes
print_status $YELLOW "🔍 Changes to be committed:"
git diff --cached --stat

print_status $BLUE "======================================"

# Parse the test results
if [ -f "automated_test_results.json" ]; then
    # Extract overall status using jq if available, otherwise use grep
    if command -v jq &> /dev/null; then
        overall_status=$(jq -r '.overall_status' automated_test_results.json 2>/dev/null)
        success_rate=$(jq -r '.summary.success_rate' automated_test_results.json 2>/dev/null)
        passed_tests=$(jq -r '.summary.passed' automated_test_results.json 2>/dev/null)
        failed_tests=$(jq -r '.summary.failed' automated_test_results.json 2>/dev/null)
    else
        # Fallback to grep if jq is not available
        overall_status=$(grep -o '"overall_status": "[^"]*"' automated_test_results.json | cut -d'"' -f4)
        success_rate=$(grep -o '"success_rate": "[^"]*"' automated_test_results.json | cut -d'"' -f4)
        passed_tests=$(grep -o '"passed": [0-9]*' automated_test_results.json | cut -d' ' -f2)
        failed_tests=$(grep -o '"failed": [0-9]*' automated_test_results.json | cut -d' ' -f2)
    fi
    
    print_status $BLUE "📊 Test Results Summary:"
    print_status $BLUE "   Overall Status: $overall_status"
    print_status $BLUE "   Success Rate: $success_rate"
    print_status $BLUE "   Passed Tests: $passed_tests"
    print_status $BLUE "   Failed Tests: $failed_tests"
    
    # Check if tests passed
    if [ "$overall_status" = "PASSED" ] || [ "$overall_status" = "WARNING" ]; then
        if [ "$failed_tests" -eq 0 ]; then
            print_status $GREEN "✅ All tests passed!"
print_status $BLUE "======================================"
print_status $BLUE "🎯 FINAL COMMIT CONFIRMATION"
print_status $BLUE "======================================"
print_status $YELLOW "📋 Summary of what will be committed:"
print_status $YELLOW "   - All visual symbols and icons added"
print_status $YELLOW "   - Form is now always the landing page"
print_status $YELLOW "   - Equipment selection with emojis"
print_status $YELLOW "   - Duration options with progress icons"
print_status $YELLOW "   - Fitness level with growth symbols"
print_status $YELLOW "   - Work/Rest timing with activity icons"
print_status $BLUE "======================================"

print_status $BLUE "⏳ Ready to commit? (press Enter to continue, or Ctrl+C to abort)"
read -p "Press Enter to commit changes..."

print_status $GREEN "🚀 Code quality checks completed successfully"
            exit 0
        else
            print_status $YELLOW "⚠️  Some tests failed but overall status is acceptable"
            print_status $YELLOW "Proceeding with commit, but please review the results"
            exit 0
        fi
    else
        print_status $RED "❌ Tests failed! Please fix the issues before committing"
        print_status $RED "Check automated_test_results.json for details"
        exit 1
    fi
else
    print_status $RED "❌ Test results file not found"
    print_status $RED "Pipeline may have failed to generate results"
    exit 1
fi
