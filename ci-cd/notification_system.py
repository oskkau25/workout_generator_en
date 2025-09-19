#!/usr/bin/env python3
"""
🔔 Enhanced Pipeline Notification System
======================================
Rich notifications and reporting for CI/CD pipeline results
"""

import json
import smtplib
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import logging

logger = logging.getLogger(__name__)

class NotificationSystem:
    def __init__(self, config_path: Optional[Path] = None):
        self.config_path = config_path or Path(__file__).parent / 'notification_config.json'
        self.config = self._load_config()
        
    def _load_config(self) -> Dict:
        """Load notification configuration"""
        default_config = {
            'slack': {
                'enabled': False,
                'webhook_url': '',
                'channel': '#ci-cd'
            },
            'email': {
                'enabled': False,
                'smtp_server': 'smtp.gmail.com',
                'smtp_port': 587,
                'username': '',
                'password': '',
                'from_email': '',
                'to_emails': []
            },
            'webhook': {
                'enabled': False,
                'url': '',
                'headers': {}
            }
        }
        
        if self.config_path.exists():
            try:
                with open(self.config_path, 'r') as f:
                    return {**default_config, **json.load(f)}
            except Exception as e:
                logger.warning(f"Failed to load notification config: {e}")
        
        return default_config
    
    def send_test_results(self, test_results: Dict, pipeline_report: Dict):
        """Send test results via configured notification channels"""
        logger.info("🔔 Sending test result notifications")
        
        # Generate notification content
        content = self._generate_notification_content(test_results, pipeline_report)
        
        # Send via Slack
        if self.config['slack']['enabled']:
            self._send_slack_notification(content)
        
        # Send via Email
        if self.config['email']['enabled']:
            self._send_email_notification(content, pipeline_report)
        
        # Send via Webhook
        if self.config['webhook']['enabled']:
            self._send_webhook_notification(content, pipeline_report)
    
    def _generate_notification_content(self, test_results: Dict, pipeline_report: Dict) -> Dict:
        """Generate rich notification content"""
        total_tests = len(test_results.get('test_results', []))
        passed_tests = len([r for r in test_results.get('test_results', []) if r.get('status') == 'passed'])
        failed_tests = len([r for r in test_results.get('test_results', []) if r.get('status') == 'failed'])
        
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        release_ready = test_results.get('release_ready', False)
        
        # Determine status emoji and color
        if release_ready and success_rate >= 95:
            status_emoji = "✅"
            status_color = "good"
            status_text = "SUCCESS"
        elif success_rate >= 80:
            status_emoji = "⚠️"
            status_color = "warning"
            status_text = "WARNING"
        else:
            status_emoji = "❌"
            status_color = "danger"
            status_text = "FAILED"
        
        # Generate summary
        summary = f"{status_emoji} Pipeline {status_text}\n"
        summary += f"📊 Success Rate: {success_rate:.1f}% ({passed_tests}/{total_tests})\n"
        summary += f"⏱️ Execution Time: {test_results.get('execution_time', 'N/A')}\n"
        summary += f"🚀 Release Ready: {'Yes' if release_ready else 'No'}\n"
        
        # Generate test details
        test_details = []
        for result in test_results.get('test_results', []):
            status_icon = "✅" if result.get('status') == 'passed' else "❌"
            test_details.append(
                f"{status_icon} {result.get('name', 'Unknown')} "
                f"({result.get('category', 'unknown')}) - "
                f"{result.get('duration', 0):.2f}s"
            )
        
        return {
            'status_emoji': status_emoji,
            'status_color': status_color,
            'status_text': status_text,
            'summary': summary,
            'test_details': test_details,
            'failed_tests': [r for r in test_results.get('test_results', []) if r.get('status') == 'failed'],
            'execution_time': test_results.get('execution_time', 'N/A'),
            'timestamp': test_results.get('timestamp', datetime.now().isoformat())
        }
    
    def _send_slack_notification(self, content: Dict):
        """Send notification to Slack"""
        try:
            webhook_url = self.config['slack']['webhook_url']
            if not webhook_url:
                logger.warning("Slack webhook URL not configured")
                return
            
            # Create Slack message
            slack_message = {
                "channel": self.config['slack']['channel'],
                "username": "CI/CD Pipeline",
                "icon_emoji": ":robot_face:",
                "attachments": [
                    {
                        "color": content['status_color'],
                        "title": f"Workout Generator CI/CD Pipeline - {content['status_text']}",
                        "text": content['summary'],
                        "fields": [
                            {
                                "title": "Test Results",
                                "value": "\n".join(content['test_details'][:10]),  # Limit to 10 tests
                                "short": False
                            }
                        ],
                        "footer": "Enhanced CI/CD Pipeline",
                        "ts": int(datetime.now().timestamp())
                    }
                ]
            }
            
            # Add failed tests if any
            if content['failed_tests']:
                failed_details = []
                for test in content['failed_tests']:
                    failed_details.append(f"❌ {test.get('name', 'Unknown')}: {test.get('error', 'Unknown error')}")
                
                slack_message['attachments'][0]['fields'].append({
                    "title": "Failed Tests",
                    "value": "\n".join(failed_details),
                    "short": False
                })
            
            # Send to Slack
            response = requests.post(webhook_url, json=slack_message, timeout=10)
            if response.status_code == 200:
                logger.info("✅ Slack notification sent successfully")
            else:
                logger.error(f"❌ Slack notification failed: {response.status_code}")
                
        except Exception as e:
            logger.error(f"❌ Failed to send Slack notification: {e}")
    
    def _send_email_notification(self, content: Dict, pipeline_report: Dict):
        """Send notification via email"""
        try:
            email_config = self.config['email']
            if not email_config['enabled'] or not email_config['to_emails']:
                logger.warning("Email notifications not configured")
                return
            
            # Create email content
            msg = MIMEMultipart()
            msg['From'] = email_config['from_email']
            msg['To'] = ', '.join(email_config['to_emails'])
            msg['Subject'] = f"CI/CD Pipeline {content['status_text']} - Workout Generator"
            
            # HTML email body
            html_body = f"""
            <html>
            <body>
                <h2>{content['status_emoji']} CI/CD Pipeline {content['status_text']}</h2>
                <p><strong>Project:</strong> Workout Generator</p>
                <p><strong>Timestamp:</strong> {content['timestamp']}</p>
                <p><strong>Execution Time:</strong> {content['execution_time']}</p>
                
                <h3>Summary</h3>
                <pre>{content['summary']}</pre>
                
                <h3>Test Results</h3>
                <ul>
                    {''.join([f'<li>{detail}</li>' for detail in content['test_details']])}
                </ul>
                
                {'<h3>Failed Tests</h3><ul>' + ''.join([f'<li><strong>{test.get("name", "Unknown")}</strong>: {test.get("error", "Unknown error")}</li>' for test in content["failed_tests"]]) + '</ul>' if content['failed_tests'] else ''}
                
                <hr>
                <p><em>Generated by Enhanced CI/CD Pipeline</em></p>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            # Send email
            server = smtplib.SMTP(email_config['smtp_server'], email_config['smtp_port'])
            server.starttls()
            server.login(email_config['username'], email_config['password'])
            server.send_message(msg)
            server.quit()
            
            logger.info("✅ Email notification sent successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to send email notification: {e}")
    
    def _send_webhook_notification(self, content: Dict, pipeline_report: Dict):
        """Send notification via webhook"""
        try:
            webhook_config = self.config['webhook']
            if not webhook_config['enabled'] or not webhook_config['url']:
                logger.warning("Webhook notifications not configured")
                return
            
            # Prepare webhook payload
            payload = {
                'event': 'pipeline_completed',
                'status': content['status_text'].lower(),
                'timestamp': content['timestamp'],
                'summary': content['summary'],
                'test_results': content['test_details'],
                'failed_tests': content['failed_tests'],
                'execution_time': content['execution_time'],
                'release_ready': pipeline_report.get('release_ready', False)
            }
            
            # Send webhook
            headers = {
                'Content-Type': 'application/json',
                **webhook_config.get('headers', {})
            }
            
            response = requests.post(
                webhook_config['url'], 
                json=payload, 
                headers=headers, 
                timeout=10
            )
            
            if response.status_code in [200, 201, 202]:
                logger.info("✅ Webhook notification sent successfully")
            else:
                logger.error(f"❌ Webhook notification failed: {response.status_code}")
                
        except Exception as e:
            logger.error(f"❌ Failed to send webhook notification: {e}")

class HTMLReportGenerator:
    """Generate rich HTML reports for test results"""
    
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_report(self, test_results: Dict, pipeline_report: Dict):
        """Generate comprehensive HTML report"""
        html_content = self._create_html_report(test_results, pipeline_report)
        
        report_path = self.output_dir / f"pipeline_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        with open(report_path, 'w') as f:
            f.write(html_content)
        
        logger.info(f"📊 HTML report generated: {report_path}")
        return report_path
    
    def _create_html_report(self, test_results: Dict, pipeline_report: Dict) -> str:
        """Create HTML report content"""
        total_tests = len(test_results.get('test_results', []))
        passed_tests = len([r for r in test_results.get('test_results', []) if r.get('status') == 'passed'])
        failed_tests = len([r for r in test_results.get('test_results', []) if r.get('status') == 'failed'])
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CI/CD Pipeline Report - Workout Generator</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }}
                .container {{ max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }}
                .header h1 {{ margin: 0; font-size: 2.5em; }}
                .header p {{ margin: 10px 0 0 0; opacity: 0.9; }}
                .stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }}
                .stat-card {{ background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }}
                .stat-number {{ font-size: 2em; font-weight: bold; color: #007bff; }}
                .stat-label {{ color: #6c757d; margin-top: 5px; }}
                .test-results {{ padding: 0 30px 30px; }}
                .test-item {{ display: flex; justify-content: space-between; align-items: center; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid; }}
                .test-item.passed {{ background: #d4edda; border-left-color: #28a745; }}
                .test-item.failed {{ background: #f8d7da; border-left-color: #dc3545; }}
                .test-item.skipped {{ background: #fff3cd; border-left-color: #ffc107; }}
                .test-name {{ font-weight: 600; }}
                .test-duration {{ color: #6c757d; font-size: 0.9em; }}
                .footer {{ background: #f8f9fa; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center; color: #6c757d; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 CI/CD Pipeline Report</h1>
                    <p>Workout Generator - {test_results.get('timestamp', 'Unknown')}</p>
                </div>
                
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">{success_rate:.1f}%</div>
                        <div class="stat-label">Success Rate</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{total_tests}</div>
                        <div class="stat-label">Total Tests</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{passed_tests}</div>
                        <div class="stat-label">Passed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{failed_tests}</div>
                        <div class="stat-label">Failed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{test_results.get('execution_time', 'N/A')}</div>
                        <div class="stat-label">Execution Time</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{'✅' if test_results.get('release_ready') else '❌'}</div>
                        <div class="stat-label">Release Ready</div>
                    </div>
                </div>
                
                <div class="test-results">
                    <h2>Test Results</h2>
                    {self._generate_test_results_html(test_results.get('test_results', []))}
                </div>
                
                <div class="footer">
                    <p>Generated by Enhanced CI/CD Pipeline v2.0</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _generate_test_results_html(self, test_results: List[Dict]) -> str:
        """Generate HTML for test results"""
        html = ""
        for result in test_results:
            status_class = result.get('status', 'unknown')
            status_icon = "✅" if status_class == "passed" else "❌" if status_class == "failed" else "⏭️"
            
            html += f"""
            <div class="test-item {status_class}">
                <div>
                    <div class="test-name">{status_icon} {result.get('name', 'Unknown Test')}</div>
                    <div style="font-size: 0.9em; color: #6c757d; margin-top: 5px;">
                        {result.get('category', 'unknown')} • {result.get('duration', 0):.2f}s
                    </div>
                    {'<div style="color: #dc3545; margin-top: 5px; font-size: 0.9em;">' + result.get("error", "") + '</div>' if result.get('error') else ''}
                </div>
            </div>
            """
        return html

if __name__ == "__main__":
    # Example usage
    notification_system = NotificationSystem()
    
    # Sample test results
    sample_results = {
        'timestamp': datetime.now().isoformat(),
        'execution_time': '15.2 seconds',
        'release_ready': True,
        'test_results': [
            {'name': 'app_loading', 'status': 'passed', 'category': 'critical', 'duration': 2.1},
            {'name': 'ui_functionality', 'status': 'passed', 'category': 'important', 'duration': 8.5},
            {'name': 'selenium_e2e', 'status': 'passed', 'category': 'important', 'duration': 12.3}
        ]
    }
    
    # Send notifications
    notification_system.send_test_results(sample_results, sample_results)
    
    # Generate HTML report
    report_generator = HTMLReportGenerator(Path('reports/html'))
    report_generator.generate_report(sample_results, sample_results)
