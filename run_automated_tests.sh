#!/bin/bash

# 🤖 Automated Test Pipeline Runner
# =================================
# Runs comprehensive tests before releases

echo "🚀 Starting Automated Test Pipeline"
echo "=================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed or not in PATH"
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking dependencies..."
python3 -c "import requests" 2>/dev/null || {
    echo "⚠️ Installing requests package..."
    pip3 install requests
}

# Run the automated test pipeline
echo "🧪 Running automated tests..."
python3 automated_test_pipeline.py

# Check the results
if [ -f "automated_test_results.json" ]; then
    echo ""
    echo "📊 Test Results Summary:"
    echo "========================"
    
    # Extract and display key results
    OVERALL_STATUS=$(python3 -c "import json; data=json.load(open('automated_test_results.json')); print(data.get('overall_status', 'UNKNOWN'))")
    RELEASE_READY=$(python3 -c "import json; data=json.load(open('automated_test_results.json')); print(data.get('release_ready', False))")
    SUCCESS_RATE=$(python3 -c "import json; data=json.load(open('automated_test_results.json')); print(data.get('summary', {}).get('success_rate', '0%'))")
    
    echo "Overall Status: $OVERALL_STATUS"
    echo "Release Ready: $RELEASE_READY"
    echo "Success Rate: $SUCCESS_RATE"
    echo ""
    
    if [ "$RELEASE_READY" = "True" ]; then
        echo "🎉 Code is READY FOR RELEASE!"
        exit 0
    else
        echo "❌ Code is NOT ready for release. Check automated_test_results.json for details."
        exit 1
    fi
else
    echo "❌ Test results file not found"
    exit 1
fi
