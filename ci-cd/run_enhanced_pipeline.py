#!/usr/bin/env python3
"""
🚀 Enhanced Pipeline Runner
==========================
Simple script to run the enhanced CI/CD pipeline with all improvements
"""

import sys
import time
from pathlib import Path

# Add the project root to the path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from enhanced_automated_pipeline import EnhancedAutomatedPipeline
from notification_system import NotificationSystem, HTMLReportGenerator

def main():
    """Run the enhanced pipeline with all features"""
    print("🚀 Starting Enhanced CI/CD Pipeline")
    print("=" * 50)
    
    start_time = time.time()
    
    try:
        # Initialize enhanced pipeline
        pipeline = EnhancedAutomatedPipeline()
        
        # Run the pipeline
        success = pipeline.run_pipeline()
        
        # Load results
        report_path = project_root / 'reports' / 'test_results' / 'enhanced_pipeline_report.json'
        if report_path.exists():
            import json
            with open(report_path, 'r') as f:
                test_results = json.load(f)
        else:
            test_results = {}
        
        # Send notifications
        notification_system = NotificationSystem()
        notification_system.send_test_results(test_results, test_results)
        
        # Generate HTML report
        html_generator = HTMLReportGenerator(project_root / 'reports' / 'html')
        html_report_path = html_generator.generate_report(test_results, test_results)
        
        # Summary
        total_time = time.time() - start_time
        print("\n" + "=" * 50)
        print("🎉 Enhanced Pipeline Complete!")
        print(f"⏱️  Total Time: {total_time:.2f} seconds")
        print(f"📊 Success: {'✅ YES' if success else '❌ NO'}")
        print(f"📄 HTML Report: {html_report_path}")
        print("=" * 50)
        
        return 0 if success else 1
        
    except Exception as e:
        print(f"💥 Pipeline failed: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
