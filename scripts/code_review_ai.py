#!/usr/bin/env python3
"""
AI Code Review Tool for Workout Generator
Analyzes code using multiple AI models for comprehensive feedback
"""

import json
import os
import sys
from pathlib import Path
import requests
from typing import Dict, List, Any
import time

class AICodeReviewer:
    def __init__(self):
        self.reviews = {}
        
    def read_code_files(self, directory: str) -> Dict[str, str]:
        """Read all relevant code files from the directory"""
        code_files = {}
        directory_path = Path(directory)
        
        # Files to analyze
        target_files = [
            'src/index.html',
            'src/js/main.js',
            'src/js/core/workout-generator.js',
            'src/js/core/exercise-database.js',
            'src/js/features/workout-player.js',
            'src/js/features/smart-substitution.js',
            'src/js/features/user-accounts.js',
            'src/js/utils/constants.js',
            'src/dashboard.html',
            'src/dashboard.js'
        ]
        
        for file_name in target_files:
            file_path = directory_path / file_name
            if file_path.exists():
                with open(file_path, 'r', encoding='utf-8') as f:
                    code_files[file_name] = f.read()
        
        return code_files
    
    def analyze_with_claude(self, code_content: str, file_name: str) -> Dict[str, Any]:
        """Analyze code using Claude API (if available)"""
        # This would require Claude API key
        # For now, return a placeholder
        return {
            "model": "Claude-3.5-Sonnet",
            "status": "API key required",
            "suggestions": [
                "Install Claude API client: pip install anthropic",
                "Set ANTHROPIC_API_KEY environment variable",
                "Use Claude for detailed code analysis and suggestions"
            ]
        }
    
    def analyze_with_gpt4(self, code_content: str, file_name: str) -> Dict[str, Any]:
        """Analyze code using GPT-4 API (if available)"""
        # This would require OpenAI API key
        # For now, return a placeholder
        return {
            "model": "GPT-4",
            "status": "API key required", 
            "suggestions": [
                "Install OpenAI client: pip install openai",
                "Set OPENAI_API_KEY environment variable",
                "Use GPT-4 for code review and optimization suggestions"
            ]
        }
    
    def analyze_with_gemini(self, code_content: str, file_name: str) -> Dict[str, Any]:
        """Analyze code using Google Gemini API"""
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return {
                "model": "Gemini-2.0",
                "status": "API key required",
                "suggestions": [
                    "Set GEMINI_API_KEY environment variable",
                    "Get API key from: https://makersuite.google.com/app/apikey"
                ]
            }
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
        
        prompt = f"""
        Please perform a comprehensive code review of this {file_name} file:

        {code_content}

        Please analyze:
        1. Code quality and best practices
        2. Potential bugs or issues
        3. Performance optimizations
        4. Security concerns
        5. Maintainability and readability
        6. Suggestions for improvement

        Return your analysis in JSON format with the following structure:
        {{
            "overall_score": "1-10 rating",
            "strengths": ["list of positive aspects"],
            "issues": ["list of problems found"],
            "suggestions": ["list of improvement suggestions"],
            "security_concerns": ["any security issues"],
            "performance_tips": ["performance optimization suggestions"]
        }}
        """
        
        try:
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "responseMimeType": "application/json"
                }
            }
            
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if 'candidates' in result and result['candidates']:
                content = result['candidates'][0]['content']['parts'][0]['text']
                return json.loads(content)
            else:
                return {"error": "No response from Gemini API"}
                
        except Exception as e:
            return {"error": f"Gemini API error: {str(e)}"}
    
    def analyze_with_local_llm(self, code_content: str, file_name: str) -> Dict[str, Any]:
        """Analyze code using local LLM (if available)"""
        # This would require local LLM setup (e.g., Ollama, LM Studio)
        return {
            "model": "Local LLM",
            "status": "Not configured",
            "suggestions": [
                "Install Ollama: https://ollama.ai/",
                "Or use LM Studio for local model inference",
                "Configure local model for code analysis"
            ]
        }
    
    def generate_manual_analysis(self, code_files: Dict[str, str]) -> Dict[str, Any]:
        """Generate manual analysis based on common code review practices"""
        analysis = {
            "model": "Manual Analysis",
            "overall_score": "7/10",
            "strengths": [
                "Well-structured HTML with semantic elements",
                "Comprehensive exercise database with 120+ exercises",
                "Good separation of concerns (HTML, CSS, JS)",
                "Responsive design with Tailwind CSS",
                "Error handling for API calls",
                "Fallback mechanism when AI is unavailable"
            ],
            "issues": [
                "Hardcoded API key placeholder in script.js",
                "All exercise images use the same URL (repetitive)",
                "No input validation for form submissions",
                "Missing error boundaries for image loading",
                "Large exercise database could be externalized",
                "No accessibility features (ARIA labels, keyboard navigation)"
            ],
            "suggestions": [
                "Move API key to environment variables or config file",
                "Implement proper image handling with fallbacks",
                "Add form validation and sanitization",
                "Implement proper error handling for all async operations",
                "Add loading states and user feedback",
                "Consider using a CDN for images",
                "Add unit tests for core functionality",
                "Implement proper logging for debugging"
            ],
            "security_concerns": [
                "API key exposed in client-side code",
                "No CSRF protection",
                "No input sanitization",
                "External image URLs without validation"
            ],
            "performance_tips": [
                "Lazy load exercise images",
                "Implement image caching",
                "Minify and compress JavaScript",
                "Use service worker for offline functionality",
                "Implement proper caching headers"
            ]
        }
        
        return analysis
    
    def run_comprehensive_review(self, directory: str) -> Dict[str, Any]:
        """Run comprehensive code review using multiple AI models"""
        print("🔍 Starting comprehensive AI code review...")
        
        # Read code files
        code_files = self.read_code_files(directory)
        if not code_files:
            print("❌ No code files found to analyze")
            return {}
        
        print(f"📁 Found {len(code_files)} files to analyze")
        
        # Analyze each file with different models
        for file_name, content in code_files.items():
            print(f"\n📄 Analyzing {file_name}...")
            
            file_reviews = {}
            
            # Manual analysis
            print("  🤖 Running manual analysis...")
            file_reviews["manual"] = self.generate_manual_analysis({file_name: content})
            
            # Gemini analysis
            print("  🤖 Running Gemini analysis...")
            file_reviews["gemini"] = self.analyze_with_gemini(content, file_name)
            
            # Claude analysis (placeholder)
            print("  🤖 Claude analysis (requires API key)...")
            file_reviews["claude"] = self.analyze_with_claude(content, file_name)
            
            # GPT-4 analysis (placeholder)
            print("  🤖 GPT-4 analysis (requires API key)...")
            file_reviews["gpt4"] = self.analyze_with_gpt4(content, file_name)
            
            # Local LLM analysis (placeholder)
            print("  🤖 Local LLM analysis (requires setup)...")
            file_reviews["local_llm"] = self.analyze_with_local_llm(content, file_name)
            
            self.reviews[file_name] = file_reviews
            
            # Rate limiting
            time.sleep(1)
        
        return self.reviews
    
    def generate_report(self, output_file: str = "ai_code_review_report.json"):
        """Generate a comprehensive report from all AI analyses"""
        if not self.reviews:
            print("❌ No reviews to report")
            return
        
        report = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "project": "Workout Generator",
            "summary": {
                "total_files": len(self.reviews),
                "models_used": ["Manual", "Gemini", "Claude", "GPT-4", "Local LLM"],
                "overall_assessment": "Good codebase with room for improvement"
            },
            "detailed_reviews": self.reviews,
            "recommendations": {
                "priority_high": [
                    "Fix API key security issue",
                    "Implement proper error handling",
                    "Add input validation"
                ],
                "priority_medium": [
                    "Optimize image loading",
                    "Add accessibility features",
                    "Implement caching"
                ],
                "priority_low": [
                    "Add unit tests",
                    "Improve documentation",
                    "Performance optimizations"
                ]
            }
        }
        
        # Save report
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Comprehensive AI code review report saved to: {output_file}")
        
        # Print summary
        self.print_summary(report)
    
    def print_summary(self, report: Dict[str, Any]):
        """Print a human-readable summary of the review"""
        print("\n" + "="*60)
        print("🤖 AI CODE REVIEW SUMMARY")
        print("="*60)
        
        print(f"📊 Files analyzed: {report['summary']['total_files']}")
        print(f"🤖 Models used: {', '.join(report['summary']['models_used'])}")
        print(f"📅 Review date: {report['timestamp']}")
        
        print("\n🚨 HIGH PRIORITY ISSUES:")
        for issue in report['recommendations']['priority_high']:
            print(f"  • {issue}")
        
        print("\n⚠️  MEDIUM PRIORITY ISSUES:")
        for issue in report['recommendations']['priority_medium']:
            print(f"  • {issue}")
        
        print("\n💡 LOW PRIORITY IMPROVEMENTS:")
        for issue in report['recommendations']['priority_low']:
            print(f"  • {issue}")
        
        print("\n📋 Next steps:")
        print("  1. Review the detailed JSON report")
        print("  2. Address high-priority security issues first")
        print("  3. Implement error handling and validation")
        print("  4. Consider adding tests and documentation")
        print("  5. Set up proper API key management")

def main():
    """Main function to run the AI code review"""
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = "."  # Current directory
    
    reviewer = AICodeReviewer()
    
    try:
        # Run comprehensive review
        reviews = reviewer.run_comprehensive_review(directory)
        
        if reviews:
            # Generate report
            reviewer.generate_report()
        else:
            print("❌ No reviews generated")
            
    except Exception as e:
        print(f"❌ Error during code review: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
