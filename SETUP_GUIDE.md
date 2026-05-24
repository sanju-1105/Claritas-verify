# Claritas Verify - Complete Setup Guide

## 🎯 Project Overview

This project consists of:
- **Frontend**: React + Vite + TypeScript + Tailwind (deploys to Netlify)
- **Backend**: Python Flask API for Email OTP verification (deploys to Render)

---

## 📁 Project Structure

```
claritas-verify/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── context/            # Auth context
│   ├── config/             # API configuration
│   └── ...
├── backend/                # Flask backend
│   ├── app.py              # Main Flask app
│   ├── otp_store.py        # OTP storage module
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment variables (DO NOT COMMIT)
│   ├── .env.example        # Environment template
│   ├── Procfile            # For deployment
│   └── render.yaml         # Render deployment config
├── public/                 # Static assets
├── index.html              # Entry HTML
├── package.json            # Node dependencies
├── .env.example            # Frontend env template
└── SETUP_GUIDE.md          # This file
```

---

## 🚀 Quick Start - Local Development

### Step 1: Start the Backend

```bash
# Open terminal 1 - Backend

# Navigate to backend folder
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

Backend will run at: `http://localhost:5000`

### Step 2: Start the Frontend

```bash
# Open terminal 2 - Frontend

# In the root project folder
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

### Step 3: Test the OTP Flow

1. Go to `http://localhost:5173/#/register`
2. Fill out the registration form
3. Click "Continue" - OTP will be sent to the email
4. Check your email for the 6-digit code
5. Enter the code and verify

---

## 🔧 Environment Variables

### Backend (.env)

Already configured at `backend/.env`:

```env
FLASK_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=amansi0300@gmail.com
SMTP_PASSWORD=ksypsgedgmqxslms
SENDER_NAME=Claritas Verify
```

### Frontend (.env.local)

Create `/.env.local` for local development:

```env
VITE_API_URL=http://localhost:5000
```

For production, update with your Render backend URL:

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🌐 Deployment

### Deploy Backend to Render

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add OTP backend"
   git push origin main
   ```

2. **Go to [Render Dashboard](https://dashboard.render.com)**

3. **Create New Web Service**:
   - Connect your GitHub repository
   - Configure:
     - **Name**: claritas-verify-api
     - **Region**: Singapore
     - **Branch**: main
     - **Root Directory**: backend
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app`

4. **Add Environment Variables** in Render:
   ```
   FLASK_ENV=production
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=amansi0300@gmail.com
   SMTP_PASSWORD=ksypsgedgmqxslms
   SENDER_NAME=Claritas Verify
   FRONTEND_URL=https://your-app.netlify.app
   ```

5. **Deploy** and copy your backend URL (e.g., `https://claritas-verify-api.onrender.com`)

### Deploy Frontend to Netlify

1. **Update frontend environment**:
   
   In Netlify dashboard → Site Settings → Environment Variables:
   ```
   VITE_API_URL=https://claritas-verify-api.onrender.com
   ```

2. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

3. **Deploy**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/send-otp` | Send OTP to email |
| `POST` | `/api/verify-otp` | Verify OTP code |
| `POST` | `/api/check-verification` | Check if email verified |
| `POST` | `/api/clear-verification` | Clear verification record |

### Example Requests

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

---

## 🔒 Security Features

- ✅ OTP expires after 5 minutes
- ✅ Max 5 verification attempts per OTP
- ✅ 60-second cooldown between resends
- ✅ Max 10 OTP requests per hour per email
- ✅ CORS configured for frontend domains only
- ✅ Email validation on both frontend and backend
- ✅ Credentials stored in environment variables (never in code)

---

## 🐛 Troubleshooting

### "Failed to send OTP" Error

1. Check backend is running: `http://localhost:5000/health`
2. Verify Gmail App Password is correct
3. Make sure 2FA is enabled on Gmail
4. Check backend console for error logs

### CORS Errors

1. Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
2. For local dev, it should be `http://localhost:5173`

### OTP Not Received

1. Check spam/junk folder
2. Verify email address is correct
3. Wait for cooldown if you've sent multiple requests

### Backend Not Starting

1. Make sure virtual environment is activated
2. Run `pip install -r requirements.txt` again
3. Check Python version (3.9+ required)

---

## 📝 Terminal Commands Summary

```bash
# ===== BACKEND =====
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py

# ===== FRONTEND =====
npm install
npm run dev

# ===== BUILD =====
npm run build

# ===== GIT =====
git add .
git commit -m "Your message"
git push origin main
```

---

## 🎉 You're All Set!

The email OTP verification system is now integrated into your Claritas Verify website. Users must verify their email before registration is complete.

**Live URLs after deployment:**
- Frontend: `https://your-app.netlify.app`
- Backend: `https://claritas-verify-api.onrender.com`
