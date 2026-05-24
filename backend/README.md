# Claritas Verify - OTP Backend

Flask API for email OTP verification.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Gmail account with App Password enabled

### Setup Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Factor Authentication** if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and generate a new app password
5. Copy the 16-character password

### Local Development

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# On Windows PowerShell:
# cp .env.example .env
# On Windows CMD:
# copy .env.example .env

# Edit .env with your credentials
# EMAIL=your-email@gmail.com
# APP_PASSWORD=your-16-char-app-password
# Alternatively use SMTP_EMAIL and SMTP_PASSWORD if desired.

# Run the server
python app.py
```

Server will start at `http://localhost:5000`

### Environment Modes

- Use `.env.example` for local development and simple production setup.
- Use `.env.production.example` for production-ready deployment values.
- Set `FLASK_ENV=production` and `DEV_EMAIL_BACKUP=false` in production.

### Email configuration options

The backend supports two modes:

1. **Preferred yagmail mode**
   - `EMAIL` and `APP_PASSWORD`
   - This matches the `BGV-AI-Agent/Email_Agent/main.py` environment style.

2. **SMTP fallback mode**
   - `SMTP_SERVER`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`

If `EMAIL` and `APP_PASSWORD` are set, the backend will use yagmail first.
If they are missing, it will fall back to standard SMTP.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/send-otp` | Send OTP to email |
| POST | `/api/verify-otp` | Verify OTP |
| POST | `/api/check-verification` | Check if email is verified |
| POST | `/api/clear-verification` | Clear verification record |

### Request/Response Examples

**Send OTP:**
```bash
curl -X POST http://localhost:5000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Verify OTP:**
```bash
curl -X POST http://localhost:5000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

## 🚀 Deploy to Render

### Option 1: Using render.yaml (Recommended)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Blueprint"
4. Connect your GitHub repo
5. It will auto-detect `render.yaml`
6. Fill in the environment variables when prompted

### Option 2: Manual Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** claritas-verify-api
   - **Region:** Singapore (closest to India)
   - **Branch:** main
   - **Root Directory:** backend
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Add Environment Variables:
   - `FLASK_ENV` = production
   - `EMAIL` = your-email@gmail.com
   - `APP_PASSWORD` = your-16-character-app-password
   - `SENDER_NAME` = Claritas Verify
   - `FRONTEND_URL` = https://your-app.netlify.app

   Optional SMTP fallback variables (only if you don't use `EMAIL`/`APP_PASSWORD`):
   - `SMTP_SERVER` = smtp.gmail.com
   - `SMTP_PORT` = 587
   - `SMTP_EMAIL` = your-email@gmail.com
   - `SMTP_PASSWORD` = your-app-password
   - `DEV_EMAIL_BACKUP` = false

## 🔒 Security Notes

- Never commit `.env` file
- Use App Password, not your Gmail password
- Rate limiting is built-in (10 OTPs/hour per email)
- OTPs expire after 5 minutes
- Max 5 verification attempts per OTP

## 📁 Project Structure

```
backend/
├── app.py              # Main Flask application
├── otp_store.py        # OTP storage & management
├── requirements.txt    # Python dependencies
├── Procfile           # For Render/Heroku
├── render.yaml        # Render deployment config
├── .env.example       # Environment template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```
