#!/bin/bash

# AI Code Review Runner for Workout Generator
echo "🤖 AI Code Review Tool for Workout Generator"
echo "=============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking dependencies..."
python3 -c "import requests, json, os, sys, pathlib" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Installing required packages..."
    pip3 install -r requirements.txt
fi

# Run the AI code review
echo "🔍 Starting AI code review..."
python3 code_review_ai.py

echo ""
echo "✅ Review complete! Check ai_code_review_report.json for detailed results."
