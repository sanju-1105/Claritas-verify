"""
Claritas Verify - OTP Verification Backend
Flask API for email OTP verification
"""

import os
import re
import smtplib
import logging
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
try:
    import yagmail
except Exception:
    yagmail = None
from functools import wraps
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from otp_store import otp_store

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS - allow requests from the frontend or fallback to allow all for deployments
cors_origins = [
    "http://localhost:5173",      # Vite dev server
    "http://localhost:3000",      # Alternative dev port
    "http://127.0.0.1:5173",
    "https://claritasverify.netlify.app",  # Your Netlify domain
    "https://*.netlify.app",      # Any Netlify preview
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    cors_origins.append(frontend_url)

if frontend_url:
    CORS(app, origins=cors_origins, supports_credentials=False)
else:
    CORS(app)

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")  # App password for Gmail
SENDER_NAME = os.getenv("SENDER_NAME", "Claritas Verify")

# Also support yagmail-style env vars (from main.py)
YAG_EMAIL = os.getenv("EMAIL") or os.getenv("YAG_EMAIL")
YAG_PASSWORD = os.getenv("APP_PASSWORD") or os.getenv("YAG_PASSWORD")

# Validation regex
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')


def validate_email(email: str) -> bool:
    """Validate email format"""
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))


def send_otp_email(to_email: str, otp: str) -> tuple[bool, str]:
    """
    Send OTP email via Gmail SMTP
    Returns: (success, error_message)
    """
    # If SMTP credentials are missing, allow a development fallback that
    # writes OTPs to a local debug file so flows can be tested without SMTP.
    dev_fallback = os.getenv('DEV_EMAIL_BACKUP', 'true').lower() in ('1', 'true', 'yes')
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        if dev_fallback and (os.getenv('FLASK_ENV') == 'development' or dev_fallback):
            debug_file = os.path.join(os.path.dirname(__file__), 'last_otp.txt')
            try:
                with open(debug_file, 'a', encoding='utf-8') as f:
                    f.write(f"{datetime.utcnow().isoformat()} | {to_email} | {otp}\n")
                logger.info("SMTP not configured: wrote OTP for %s to %s", to_email, debug_file)
                return True, f"OTP written to debug file: {debug_file}"
            except Exception as e:
                logger.error("Failed to write OTP debug file: %s", str(e))
                return False, "Email service not configured and debug fallback failed"
        logger.error("SMTP credentials not configured")
        return False, "Email service not configured"
    
    # Prepare plain text and HTML content for the email
    text_content = f"""
Your Verification Code

{otp}

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

---
Claritas Verify Pvt Ltd
Your Global Screening Partner
        """
    
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(10, 31, 68, 0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 24px; text-align: center; border-bottom: 1px solid #e8edf5;">
                            <div style="display: inline-flex; align-items: center; gap: 8px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #14B8A6, #0D9488); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <span style="color: white; font-size: 20px;">✓</span>
                                </div>
                                <div style="text-align: left;">
                                    <div style="font-size: 18px; font-weight: 700; color: #0A1F44; line-height: 1.2;">Claritas Verify</div>
                                    <div style="font-size: 9px; font-weight: 600; color: #14B8A6; text-transform: uppercase; letter-spacing: 1px;">Your Global Screening Partner</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #0A1F44; text-align: center;">
                                Verify Your Email
                            </h1>
                            <p style="margin: 0 0 32px; font-size: 15px; color: #64748b; text-align: center; line-height: 1.6;">
                                Use the verification code below to complete your registration. This code expires in <strong>5 minutes</strong>.
                            </p>
                            
                            <!-- OTP Code -->
                            <div style="background: linear-gradient(135deg, #f0fdfa, #f0f9ff); border: 2px dashed #14B8A6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                                <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0A1F44; font-family: 'Courier New', monospace;">
                                    {otp}
                                </div>
                            </div>
                            
                            <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.6;">
                                If you didn't request this code, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                                © {datetime.now().year} Claritas Verify Pvt Ltd. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        """

    # If yagmail is configured, prefer it (uses Gmail API-friendly envelopes)
    if yagmail is not None and YAG_EMAIL and YAG_PASSWORD:
        logger.info("Attempting to send OTP via yagmail to %s", to_email)
        yag_text = f"Your Verification Code\n\n{otp}\n\nThis code will expire in 5 minutes."
        try:
            yag = yagmail.SMTP(user=YAG_EMAIL, password=YAG_PASSWORD)
            yag.send(to=to_email, subject=f'Your Verification Code: {otp} - Claritas Verify', contents=[yag_text, html_content])
            logger.info("OTP email sent successfully to %s (yagmail)", to_email)
            return True, "OTP sent successfully"
        except Exception as ye:
            logger.warning("Yagmail send failed for %s: %s", to_email, str(ye))
            # Fall through to smtplib path

    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Your Verification Code: {otp} - Claritas Verify'
        msg['From'] = f'{SENDER_NAME} <{SMTP_EMAIL}>'
        msg['To'] = to_email
        
        # Plain text version
        text_content = f"""
Your Verification Code

{otp}

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

---
Claritas Verify Pvt Ltd
Your Global Screening Partner
        """
        
        # HTML version
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(10, 31, 68, 0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 24px; text-align: center; border-bottom: 1px solid #e8edf5;">
                            <div style="display: inline-flex; align-items: center; gap: 8px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #14B8A6, #0D9488); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                    <span style="color: white; font-size: 20px;">✓</span>
                                </div>
                                <div style="text-align: left;">
                                    <div style="font-size: 18px; font-weight: 700; color: #0A1F44; line-height: 1.2;">Claritas Verify</div>
                                    <div style="font-size: 9px; font-weight: 600; color: #14B8A6; text-transform: uppercase; letter-spacing: 1px;">Your Global Screening Partner</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #0A1F44; text-align: center;">
                                Verify Your Email
                            </h1>
                            <p style="margin: 0 0 32px; font-size: 15px; color: #64748b; text-align: center; line-height: 1.6;">
                                Use the verification code below to complete your registration. This code expires in <strong>5 minutes</strong>.
                            </p>
                            
                            <!-- OTP Code -->
                            <div style="background: linear-gradient(135deg, #f0fdfa, #f0f9ff); border: 2px dashed #14B8A6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                                <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0A1F44; font-family: 'Courier New', monospace;">
                                    {otp}
                                </div>
                            </div>
                            
                            <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.6;">
                                If you didn't request this code, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                                © {datetime.now().year} Claritas Verify Pvt Ltd. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        """
        
        # Attach both versions
        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)

            # Attempt to send using send_message first (preserves MIME headers)
            try:
                logger.info(f"Attempting to send OTP to %s via send_message", to_email)
                server.send_message(msg)
                logger.info(f"OTP email sent successfully to %s (send_message)", to_email)
                return True, "OTP sent successfully"
            except smtplib.SMTPRecipientsRefused as e:
                # Recipient refused — log and attempt fallback
                logger.warning("Recipient refused when sending to %s: %s", to_email, str(e))
                try:
                    logger.info(f"Falling back to sendmail for recipient %s", to_email)
                    server.sendmail(SMTP_EMAIL, [to_email], msg.as_string())
                    logger.info(f"OTP email sent successfully to %s (sendmail fallback)", to_email)
                    return True, "OTP sent successfully"
                except Exception as ex:
                    logger.error("Fallback sendmail failed for %s: %s", to_email, str(ex))
                    return False, f"Failed to send email: {str(ex)}"
            except Exception as e:
                # Any other error sending message
                logger.error(f"Error sending message to %s via send_message: %s", to_email, str(e))
                # Try fallback sendmail as a last resort
                try:
                    server.sendmail(SMTP_EMAIL, [to_email], msg.as_string())
                    logger.info(f"OTP email sent successfully to %s (sendmail after error)", to_email)
                    return True, "OTP sent successfully"
                except Exception as ex:
                    logger.error("Fallback sendmail failed for %s: %s", to_email, str(ex))
                    return False, f"Failed to send email: {str(ex)}"
        
    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP authentication failed")
        return False, "Email authentication failed"
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error: {str(e)}")
        return False, "Failed to send email"
    except Exception as e:
        logger.error(f"Unexpected error sending email: {str(e)}")
        return False, "An unexpected error occurred"


def rate_limit_check(f):
    """Simple rate limiting decorator"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Add IP-based rate limiting here if needed
        return f(*args, **kwargs)
    return decorated_function


# ============================================
# API ROUTES
# ============================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Claritas Verify OTP API",
        "timestamp": datetime.utcnow().isoformat()
    })


@app.route('/api/send-otp', methods=['POST'])
@rate_limit_check
def send_otp():
    """
    Send OTP to the provided email address
    
    Request body:
    {
        "email": "user@example.com"
    }
    
    Response:
    {
        "success": true/false,
        "message": "...",
        "cooldown": 60  // seconds until next OTP can be sent (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400
        
        email = data.get('email', '').strip().lower()
        logger.info(f"Received OTP send request for: %s", email)
        
        # Validate email
        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required"
            }), 400
        
        if not validate_email(email):
            return jsonify({
                "success": False,
                "message": "Please enter a valid email address"
            }), 400
        
        # Check if we can send OTP (rate limiting & cooldown)
        can_send, error_msg, wait_time = otp_store.can_send_otp(email)
        if not can_send:
            response = {
                "success": False,
                "message": error_msg
            }
            if wait_time:
                response["cooldown"] = wait_time
            return jsonify(response), 429
        
        # Generate OTP
        otp, error = otp_store.create_otp(email)
        if not otp:
            return jsonify({
                "success": False,
                "message": error or "Failed to generate OTP"
            }), 500
        
        # Send OTP email
        success, message = send_otp_email(email, otp)
        
        if success:
            return jsonify({
                "success": True,
                "message": "Verification code sent to your email",
                "expiresIn": 300  # 5 minutes
            })
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 500
            
    except Exception as e:
        logger.error(f"Error in send_otp: {str(e)}")
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred"
        }), 500


@app.route('/api/verify-otp', methods=['POST'])
@rate_limit_check
def verify_otp():
    """
    Verify the OTP for the provided email
    
    Request body:
    {
        "email": "user@example.com",
        "otp": "123456"
    }
    
    Response:
    {
        "success": true/false,
        "message": "...",
        "verified": true/false
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400
        
        email = data.get('email', '').strip().lower()
        otp = data.get('otp', '').strip()
        
        # Validate inputs
        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required"
            }), 400
        
        if not otp:
            return jsonify({
                "success": False,
                "message": "OTP is required"
            }), 400
        
        if not validate_email(email):
            return jsonify({
                "success": False,
                "message": "Invalid email format"
            }), 400
        
        # Verify OTP
        success, message = otp_store.verify_otp(email, otp)
        
        return jsonify({
            "success": success,
            "message": message,
            "verified": success
        }), 200 if success else 400
        
    except Exception as e:
        logger.error(f"Error in verify_otp: {str(e)}")
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred"
        }), 500


@app.route('/api/check-verification', methods=['POST'])
def check_verification():
    """
    Check if an email has been verified
    
    Request body:
    {
        "email": "user@example.com"
    }
    """
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email or not validate_email(email):
            return jsonify({
                "success": False,
                "verified": False
            }), 400
        
        is_verified = otp_store.is_verified(email)
        
        return jsonify({
            "success": True,
            "verified": is_verified
        })
        
    except Exception as e:
        logger.error(f"Error in check_verification: {str(e)}")
        return jsonify({
            "success": False,
            "verified": False
        }), 500


@app.route('/api/debug/get-otp', methods=['GET'])
def debug_get_otp():
    """Development-only endpoint to fetch the current OTP for an email."""
    if os.getenv('FLASK_ENV') != 'development':
        return jsonify({"success": False, "message": "Not allowed"}), 403

    email = request.args.get('email', '').strip().lower()
    if not email or not validate_email(email):
        return jsonify({"success": False, "message": "Invalid email"}), 400

    # Inspect the internal store (development only)
    record = getattr(otp_store, '_store', {}).get(email)
    if not record:
        return jsonify({"success": False, "message": "No OTP found for this email"}), 404

    return jsonify({
        "success": True,
        "email": email,
        "otp": record.otp,
        "createdAt": record.created_at,
        "verified": record.verified
    })


@app.route('/api/register', methods=['POST'])
def register_user():
    """
    Register a user after OTP verification

    Request body:
    {
        "email": "user@example.com",
        "fullName": "User Name",
        "position": "HR Manager",
        "companyName": "Acme Corp"
    }
    """
    try:
        data = request.get_json() or {}
        email = (data.get('email') or '').strip().lower()
        full_name = (data.get('fullName') or '').strip()
        position = (data.get('position') or '').strip()
        company = (data.get('companyName') or '').strip()

        if not email or not validate_email(email):
            return jsonify({"success": False, "message": "Invalid email"}), 400

        # Check OTP verification state
        if not otp_store.is_verified(email):
            return jsonify({"success": False, "message": "Email not verified"}), 400

        # Persist user to users.json (append)
        users_file = os.path.join(os.path.dirname(__file__), 'users.json')
        users = []
        try:
            if os.path.exists(users_file):
                with open(users_file, 'r', encoding='utf-8') as f:
                    users = json.load(f)
        except Exception:
            users = []

        user_record = {
            'email': email,
            'fullName': full_name,
            'position': position,
            'companyName': company,
            'registeredAt': datetime.utcnow().isoformat()
        }

        users.append(user_record)

        with open(users_file, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2)

        # Clear OTP verification record
        otp_store.clear_verified(email)

        logger.info("Registered new user: %s", email)

        return jsonify({"success": True, "message": "User registered successfully"}), 201

    except Exception as e:
        logger.error(f"Error in register_user: {str(e)}")
        return jsonify({"success": False, "message": "An unexpected error occurred"}), 500


@app.route('/api/clear-verification', methods=['POST'])
def clear_verification():
    """
    Clear verification record after successful registration
    
    Request body:
    {
        "email": "user@example.com"
    }
    """
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if email and validate_email(email):
            otp_store.clear_verified(email)
        
        return jsonify({"success": True})
        
    except Exception as e:
        logger.error(f"Error in clear_verification: {str(e)}")
        return jsonify({"success": False}), 500


# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "success": False,
        "message": "Endpoint not found"
    }), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({
        "success": False,
        "message": "Method not allowed"
    }), 405


@app.errorhandler(500)
def internal_error(e):
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Claritas Verify OTP API on port {port}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
