#!/bin/bash

# 🚨 Pre-commit Hook for Workout Generator
# ========================================
# Run this before committing to ensure code quality

echo "🚨 Pre-commit Quality Check"
echo "============================"

# Check if automated test pipeline exists
if [ ! -f "run_automated_tests.sh" ]; then
    echo "❌ Automated test pipeline not found. Please run: git pull origin main"
    exit 1
fi

# Run the automated test pipeline
echo "🧪 Running automated tests..."
./run_automated_tests.sh

# Check the results
if [ -f "automated_test_results.json" ]; then
    OVERALL_STATUS=$(python3 -c "import json; data=json.load(open('automated_test_results.json')); print(data.get('overall_status', 'UNKNOWN'))")
    RELEASE_READY=$(python3 -c "import json; data=json.load(open('automated_test_results.json')); print(data.get('release_ready', False))")
    
    echo ""
    echo "📊 Pre-commit Check Results:"
    echo "============================"
    echo "Overall Status: $OVERALL_STATUS"
    echo "Release Ready: $RELEASE_READY"
    
    if [ "$RELEASE_READY" = "True" ]; then
        echo ""
        echo "✅ Pre-commit check PASSED - You can commit safely!"
        echo "💡 Consider running: git add . && git commit -m 'your message'"
        exit 0
    else
        echo ""
        echo "❌ Pre-commit check FAILED - Please fix issues before committing"
        echo "📋 Check automated_test_results.json for detailed information"
        echo "🔧 Fix the issues and run this script again"
        exit 1
    fi
else
    echo "❌ Test results file not found"
    exit 1
fi
