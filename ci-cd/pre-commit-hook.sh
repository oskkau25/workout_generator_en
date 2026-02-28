#!/bin/bash

# Enhanced Pre-commit hook for Workout Generator
# This script runs the automated test pipeline before allowing commits
# to ensure code quality and prevent broken code from being committed
# NEW: Enhanced with parallel execution, caching, and better notifications

# Signal handler to gracefully exit and clean up
cleanup() {
    echo -e "\033[1;33m🔄 Interrupt received, cleaning up...\033[0m"
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
        prettier_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx|css|scss|html)$' || true)
        if [ -n "$prettier_files" ]; then
            printf '%s\n' "$prettier_files" | xargs -r npx prettier --write 2>/dev/null
            printf '%s\n' "$prettier_files" | xargs -r git add --
        fi
    fi
    if [ -f ".eslintrc.json" ]; then
        print_status $BLUE "Running ESLint (staged JS)"
        eslint_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' || true)
        if [ -n "$eslint_files" ]; then
            printf '%s\n' "$eslint_files" | xargs -r npx eslint --fix 2>/dev/null || true
            printf '%s\n' "$eslint_files" | xargs -r git add --
        fi
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
    gtimeout 480 python3 ci-cd/automated_test_pipeline.py --enhanced --hook-mode
elif command -v timeout &> /dev/null; then
    # Linux systems
    timeout 480 python3 ci-cd/automated_test_pipeline.py --enhanced --hook-mode
else
    # macOS without coreutils - run without timeout
    print_status $YELLOW "⚠️  No timeout command available, running pipeline without timeout"
    python3 ci-cd/automated_test_pipeline.py --enhanced --hook-mode
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

# Step 3: Final confirmation
print_section "🎯 FINAL CONFIRMATION"
print_status $GREEN "✅ All pre-commit checks passed!"
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
