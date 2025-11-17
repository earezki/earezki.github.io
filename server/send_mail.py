import os
from typing import Optional, List, Dict, Any
import requests
from dotenv import load_dotenv

load_dotenv()

MAILJET_API_KEY = os.getenv('MAILJET_API_KEY')
MAILJET_API_SECRET = os.getenv('MAILJET_API_SECRET')
MAILJET_FROM_EMAIL = os.getenv('MAILJET_FROM_EMAIL', 'noreply@earezki.com')
MAILJET_FROM_NAME = os.getenv('MAILJET_FROM_NAME', 'Dev|Journal')

MAILJET_API_URL = 'https://api.mailjet.com/v3.1/send'

if not MAILJET_API_KEY or not MAILJET_API_SECRET:
    raise ValueError('MAILJET_API_KEY and MAILJET_API_SECRET environment variables must be set')


def send_bulk_email(
    recipients: List[Dict[str, str]],
    subject: str = '',
    html_content: str = '',
    text_content: Optional[str] = None,
    reply_to: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Send email to multiple recipients using Mailjet API.
    
    Args:
        recipients: List of recipients [{'Email': 'email@example.com', 'Name': 'Name'}, ...]
        subject: Email subject
        html_content: Email body in HTML format
        text_content: Email body in plain text format (optional)
        reply_to: Reply-to email address (optional)
    
    Returns:
        Response from Mailjet API
    
    Raises:
        requests.exceptions.RequestException: If API call fails
    """
        
    if not recipients:
        raise ValueError('Recipients list cannot be empty')
    
    payload = {
        'Messages': [
            {
                'From': {
                    'Email': MAILJET_FROM_EMAIL,
                    'Name': MAILJET_FROM_NAME,
                },
                'To': recipients,
                'Subject': subject,
                'HTMLPart': html_content,
            }
        ]
    }
    
    if text_content:
        payload['Messages'][0]['TextPart'] = text_content
    
    if reply_to:
        payload['Messages'][0]['ReplyTo'] = {
            'Email': reply_to,
        }
    
    try:
        response = requests.post(
            MAILJET_API_URL,
            json=payload,
            auth=(MAILJET_API_KEY, MAILJET_API_SECRET),
            timeout=10,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'[ERROR] Failed to send bulk email: {e}')
        raise


def get_welcome_template(name: str) -> tuple[str, str]:
    """
    Generate a welcome email template.
    
    Args:
        name: Recipient's name
    
    Returns:
        A tuple containing the plain text and HTML template strings
    """
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Dev|Journal</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
            }}
            .header h1 {{
                margin: 0;
                color: #2563eb;
                font-size: 28px;
                letter-spacing: -0.5px;
            }}
            .content {{
                margin: 20px 0;
            }}
            .content p {{
                margin: 15px 0;
                color: #555;
            }}
            .cta-button {{
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: 600;
                transition: background-color 0.3s ease;
            }}
            .cta-button:hover {{
                background-color: #1d4ed8;
            }}
            .cta-button, .cta-button:visited {{
                color: white !important;
            }}
            .highlight {{
                background-color: #f0f9ff;
                padding: 20px;
                border-left: 4px solid #2563eb;
                margin: 20px 0;
                border-radius: 4px;
            }}
            .features {{
                margin: 30px 0;
            }}
            .feature-item {{
                margin: 15px 0;
                padding-left: 25px;
                position: relative;
            }}
            .feature-item::before {{
                content: "✓";
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: bold;
                font-size: 18px;
            }}
            .footer {{
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #999;
                font-size: 12px;
            }}
            .social-links {{
                text-align: center;
                margin: 20px 0;
            }}
            .social-links a {{
                display: inline-block;
                margin: 0 10px;
                color: #2563eb;
                text-decoration: none;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Dev|Journal</h1>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Welcome to our community</p>
            </div>
            
            <div class="content">
                <p>Hi <strong>{name}</strong>,</p>
                
                <p>Welcome to <strong>Dev|Journal</strong>! We're thrilled to have you join our community of developers, engineers, and tech enthusiasts.</p>
                
                <div class="highlight">
                    <p style="margin-top: 0;"><strong>What You'll Get:</strong></p>
                    <div class="features">
                        <div class="feature-item">Latest AI and tech news curated for developers</div>
                        <div class="feature-item">Financial analysis on tech stocks with AI insights</div>
                        <div class="feature-item">In-depth technical articles and tutorials</div>
                        <div class="feature-item">Expert perspectives on software engineering</div>
                        <div class="feature-item">Stock weather predictions powered by AI</div>
                    </div>
                </div>
                
                <p>Our platform combines cutting-edge AI analysis with deep technical knowledge to help you stay ahead in the fast-moving world of technology and finance.</p>
                
                <center>
                    <a href="https://earezki.com" class="cta-button">Start Exploring Dev|Journal</a>
                </center>
                
                <h3 style="color: #2563eb; margin-top: 30px;">Featured Sections:</h3>
                <ul style="color: #555;">
                    <li><strong>AI News</strong> - Latest developments in artificial intelligence</li>
                    <li><strong>AI Financial News</strong> - Stock weather and market insights</li>
                    <li><strong>Technical Posts</strong> - Deep dives into software architecture and design</li>
                    <li><strong>Resources</strong> - Tools, guides, and best practices</li>
                </ul>
                
                <p>If you have any questions or suggestions, we'd love to hear from you. Don't hesitate to reach out!</p>
                
                <p>Happy coding,<br>
                <strong>The Dev|Journal Team</strong></p>
            </div>
            
            <div class="social-links">
                <a href="https://github.com/earezki">GitHub</a> • 
                <a href="https://linkedin.com/in/mehdi-arezki">LinkedIn</a> • 
                <a href="https://earezki.com">Website</a>
            </div>
            
            <div class="footer">
                <p>You received this email because you subscribed to Dev|Journal updates.</p>
                <p style="margin: 5px 0 0 0;">© 2025 Dev|Journal. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    text = f"""
    Welcome to Dev|Journal!
    
    Hi {name},
    
    Welcome to Dev|Journal! We're thrilled to have you join our community of developers, engineers, and tech enthusiasts.
    
    What You'll Get:
    ✓ Latest AI and tech news curated for developers
    ✓ Financial analysis on tech stocks with AI insights
    ✓ In-depth technical articles and tutorials
    ✓ Expert perspectives on software engineering
    ✓ Stock weather predictions powered by AI
    
    Visit us at: https://earezki.com
    
    Happy coding,
    The Dev|Journal Team
    
    ---
    You received this email because you subscribed to Dev|Journal updates.
    © 2025 Dev|Journal. All rights reserved.
    """

    return (text, html)


def send_welcome(
    to_name: str,
    to_email: str,
    reply_to: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Send a welcome email to new subscribers using Mailjet API.
    
    Args:
        recipients: List of recipients [{'Email': 'email@example.com', 'Name': 'Name'}, ...]
        reply_to: Reply-to email address (optional)
    
    Returns:
        Response from Mailjet API
    
    Raises:
        ValueError: If recipients list is empty
        requests.exceptions.RequestException: If API call fails
    """
        
    text_content, html_content = get_welcome_template(to_name)
    
    return send_bulk_email(
        recipients=[{'Email': to_email, 'Name': to_name}] if to_name else [{'Email': to_email}],
        subject='Welcome to Dev|Journal! 🚀',
        html_content=html_content,
        text_content=text_content.strip(),
        reply_to=reply_to or MAILJET_FROM_EMAIL,
    )

