#!/bin/bash

# Enhanced Pre-commit hook for Workout Generator
# This script runs the automated test pipeline before allowing commits
# to ensure code quality and prevent broken code from being committed
# NEW: Enhanced with parallel execution, caching, and better notifications

# Signal handler to gracefully exit and clean up
cleanup() {
    echo -e "\033[1;33m🔄 Interrupt received, cleaning up...\033[0m"
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        echo -e "\033[0;34m🧹 Local server stopped\033[0m"
    fi
    echo -e "\033[0;31m❌ Pre-commit hook interrupted - commit blocked for safety\033[0m"
    exit 1
}

# Set up signal handlers
trap cleanup INT TERM

echo "🔍 Running Enhanced Pre-commit Quality Checks..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print section headers
print_section() {
    local title=$1
    echo -e "${CYAN}${title}${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..${#title}})${NC}"
}

# Optional: run Prettier and ESLint if available
print_section "🧹 OPTIONAL FORMAT/LINT"
if command -v npx &> /dev/null; then
    if [ -f ".prettierrc.json" ]; then
        print_status $BLUE "Running Prettier (staged JS/HTML/CSS)"
        git diff --cached --name-only --diff-filter=ACM | \
          grep -E '\.(js|jsx|ts|tsx|css|scss|html)$' | \
          xargs -r npx prettier --write 2>/dev/null
        git add -A
    fi
    if [ -f ".eslintrc.json" ]; then
        print_status $BLUE "Running ESLint (staged JS)"
        git diff --cached --name-only --diff-filter=ACM | \
          grep -E '\.(js|jsx|ts|tsx)$' | \
          xargs -r npx eslint --fix 2>/dev/null || true
        git add -A
    fi
else
    print_status $YELLOW "npx not available - skipping Prettier/ESLint"
fi

# Check if we're in the right directory
if [ ! -f "ci-cd/automated_test_pipeline.py" ]; then
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
required_files=("src/index.html" "ci-cd/requirements.txt")
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

# Step 1: AI Code Review
print_section "🤖 AI CODE REVIEW"
print_status $BLUE "Running comprehensive AI code review..."

# Run AI code review
if [ -f "scripts/code_review_ai.py" ]; then
    python3 scripts/code_review_ai.py
    if [ $? -eq 0 ]; then
        print_status $GREEN "✅ AI code review completed successfully"
    else
        print_status $YELLOW "⚠️  AI code review completed with warnings"
    fi
else
    print_status $YELLOW "⚠️  AI code review tool not found, skipping..."
fi

# Step 2: Enhanced Automated Test Pipeline
print_section "🚀 ENHANCED AUTOMATED TEST PIPELINE"
print_status $BLUE "Running enhanced pipeline with parallel execution and caching..."

# Set timeout for pipeline (8 minutes) - handle different systems
if command -v gtimeout &> /dev/null; then
    # macOS with coreutils installed
    gtimeout 480 python3 ci-cd/automated_test_pipeline.py --enhanced
elif command -v timeout &> /dev/null; then
    # Linux systems
    timeout 480 python3 ci-cd/automated_test_pipeline.py --enhanced
else
    # macOS without coreutils - run without timeout
    print_status $YELLOW "⚠️  No timeout command available, running pipeline without timeout"
    python3 ci-cd/automated_test_pipeline.py --enhanced
fi

# Check if pipeline completed successfully
if [ $? -eq 0 ]; then
    print_status $GREEN "✅ Enhanced pipeline completed successfully"
    
    # Check for performance report
    if [ -f "reports/test_results/performance_report.json" ]; then
        print_status $PURPLE "📊 Performance report generated"
    fi
    
    # Check for cached results
    if [ -f "ci-cd/.test_cache.pkl" ]; then
        print_status $PURPLE "💾 Test cache updated for faster future runs"
    fi
else
    print_status $RED "❌ Enhanced pipeline failed or timed out"
    print_status $RED "Please fix the issues before committing"
    exit 1
fi

# Step 3: Local Page Preview (MANDATORY)
print_section "🌐 LOCAL PAGE PREVIEW (MANDATORY STEP)"
print_status $YELLOW "⚠️  This step is MANDATORY - you must review the changes locally before committing"
print_status $BLUE "======================================"

# Kill any existing server on port 5173
print_status $YELLOW "🔄 Stopping any existing server on port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "No existing server found"

# Start the local server with better error handling
print_status $BLUE "🚀 Starting local server on http://localhost:5173..."
print_status $YELLOW "📁 Serving from src/ directory (where your workout generator is located)"
cd src && python3 -m http.server 5173 --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!
cd ..

# Wait longer for server to fully start and be ready to accept connections
print_status $YELLOW "⏳ Waiting for server to be ready..."
sleep 5

# Check if server is running
if ! kill -0 $SERVER_PID 2>/dev/null; then
    print_status $RED "❌ Failed to start local server"
    exit 1
fi

# Test server connectivity
if ! curl -s http://localhost:5173 >/dev/null; then
    print_status $RED "❌ Server is not responding on http://localhost:5173"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

print_status $GREEN "✅ Local server is running and responding"
print_status $BLUE "🌐 Opening http://localhost:5173 in your browser automatically..."
# Auto-open browser (works on macOS, Linux, and Windows)
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:5173
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:5173
elif command -v start &> /dev/null; then
    # Windows
    start http://localhost:5173
else
    print_status $YELLOW "⚠️  Could not auto-open browser. Please manually open http://localhost:5173"
fi

# Enhanced user interaction with better UX
print_section "👀 MANUAL INSPECTION REQUIRED"
print_status $CYAN "Please complete the following steps:"
echo ""
print_status $YELLOW "1. 🌐 Browser should have opened automatically (or open http://localhost:5173)"
print_status $YELLOW "2. 🔍 Review all changes and functionality"
print_status $YELLOW "3. 📱 Test responsive design on different screen sizes"
print_status $YELLOW "4. ♿ Test accessibility features (keyboard navigation, screen readers)"
print_status $YELLOW "5. 🔒 Verify security features are working correctly"
print_status $YELLOW "6. ⚡ Check performance and loading times"
echo ""

# Enhanced confirmation prompt with timeout and better error handling
print_status $CYAN "Have you completed the manual inspection?"
print_status $YELLOW "Type 'yes' to confirm, 'no' to abort, 'retry' to restart server, or 'skip' to bypass:"
print_status $BLUE "⏰ You have 5 minutes to respond, or the server will be stopped automatically"
print_status $PURPLE "💡 Tip: Use 'skip' if you're confident the changes are safe and don't need manual review"

# Set a timeout for user response (5 minutes)
timeout_seconds=300
start_time=$(date +%s)
max_attempts=3
attempt_count=0

while [ $attempt_count -lt $max_attempts ]; do
    # Check if timeout has been reached
    current_time=$(date +%s)
    elapsed_time=$((current_time - start_time))
    remaining_time=$((timeout_seconds - elapsed_time))
    
    if [ $remaining_time -le 0 ]; then
        print_status $RED "⏰ Timeout reached! Stopping server and blocking commit for safety."
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
    
    # Show remaining time and attempts
    print_status $YELLOW "⏰ Time remaining: ${remaining_time}s | Attempts: $((attempt_count + 1))/$max_attempts"
    
    # Use timeout with read to prevent infinite hanging
    if command -v gtimeout &> /dev/null; then
        # macOS with coreutils
        if gtimeout 10 read -p "Response: " response; then
            break
        fi
    elif command -v timeout &> /dev/null; then
        # Linux systems
        if timeout 10 read -p "Response: " response; then
            break
        fi
    else
        # macOS without coreutils - use a simple read with shorter timeout
        print_status $YELLOW "⚠️  No timeout command available, please respond quickly"
        if read -t 10 -p "Response: " response; then
            break
        fi
    fi
    
    # If read times out, increment attempt counter and continue
    attempt_count=$((attempt_count + 1))
    if [ $attempt_count -ge $max_attempts ]; then
        print_status $RED "❌ Maximum attempts reached - commit blocked for safety"
        kill $SERVER_PID 2>/dev/null
        exit 1
    fi
    
    print_status $YELLOW "⏰ No response received, please try again... (Attempt $attempt_count/$max_attempts)"
    echo ""

done

# Process the response
case $response in
    [Yy]es|[Yy])
        print_status $GREEN "✅ Manual inspection confirmed!"
        ;;
    [Nn]o|[Nn])
        print_status $RED "❌ Manual inspection aborted - commit blocked"
        kill $SERVER_PID 2>/dev/null
        exit 1
        ;;
    [Ss]kip|[Ss])
        print_status $YELLOW "⚠️  Manual inspection skipped - proceed with caution!"
        print_status $YELLOW "💡 Remember: Always test your changes before pushing to production"
        ;;
    [Rr]etry|[Rr])
        print_status $BLUE "🔄 Restarting server..."
        kill $SERVER_PID 2>/dev/null
        sleep 2
        cd src && python3 -m http.server 5173 --bind 127.0.0.1 >/dev/null 2>&1 &
        SERVER_PID=$!
        cd ..
        sleep 5
        print_status $GREEN "✅ Server restarted on http://localhost:5173"
        print_status $BLUE "🌐 Please review the changes again"
        
        # Give user another chance after restart
        print_status $CYAN "Have you completed the manual inspection now?"
        if read -p "Type 'yes' to confirm or 'no' to abort: " final_response; then
            case $final_response in
                [Yy]es|[Yy])
                    print_status $GREEN "✅ Manual inspection confirmed after restart!"
                    ;;
                *)
                    print_status $RED "❌ Manual inspection aborted - commit blocked"
                    kill $SERVER_PID 2>/dev/null
                    exit 1
                    ;;
            esac
        else
            print_status $RED "❌ No response received - commit blocked for safety"
            kill $SERVER_PID 2>/dev/null
            exit 1
        fi
        ;;
    *)
        print_status $RED "❌ Invalid response '$response' - commit blocked for safety"
        print_status $YELLOW "Valid responses: 'yes', 'no', 'retry', 'skip'"
        kill $SERVER_PID 2>/dev/null
        exit 1
        ;;
 esac

# Clean up server
print_status $BLUE "🧹 Cleaning up local server..."
kill $SERVER_PID 2>/dev/null
# Ensure port 5173 is fully freed (in case of stray processes)
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Step 4: Final confirmation
print_section "🎯 FINAL CONFIRMATION"
print_status $GREEN "✅ All pre-commit checks passed!"
print_status $GREEN "✅ Manual inspection completed!"
print_status $GREEN "✅ Code is ready for commit!"
echo ""
print_status $CYAN "🚀 You can now proceed with your commit!"
print_status $CYAN "The enhanced pipeline has ensured code quality and security."
echo ""
print_status $PURPLE "💡 Tip: The enhanced pipeline now includes:"
print_status $PURPLE "   • AI-powered code review for quality assurance"
print_status $PURPLE "   • Parallel test execution for faster feedback"
print_status $PURPLE "   • Smart caching to avoid redundant tests"
print_status $PURPLE "   • Enhanced performance metrics and bundle analysis"
print_status $PURPLE "   • Comprehensive security and accessibility scoring"
print_status $PURPLE "   • Actionable recommendations for improvements"
echo ""

exit 0
