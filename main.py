import pandas as pd
import yagmail
import time
import random
import json
import os
import re
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv

# ==============================
# LOAD ENV (FORCED + DEBUG)
# ==============================

load_dotenv(dotenv_path=".env", override=True)

EMAIL = os.getenv("EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")
GROQ_KEYS = os.getenv("GROQ_KEYS")

print("DEBUG EMAIL:", EMAIL)
print("DEBUG PASS:", APP_PASSWORD)
print("DEBUG KEYS:", GROQ_KEYS)

if not EMAIL or not APP_PASSWORD or not GROQ_KEYS:
    print("\n❌ ERROR: .env not loaded properly")
    input("Press Enter to exit...")
    exit()

GROQ_KEYS = GROQ_KEYS.split(",")

print("✅ ENV LOADED SUCCESSFULLY\n")

# ==============================
# API ROTATION
# ==============================

MAX_EMAILS_PER_API = 50
current_api_index = 0
current_api_usage = 0

def get_groq_client():
    global current_api_index, current_api_usage

    if current_api_usage >= MAX_EMAILS_PER_API:
        current_api_index += 1
        current_api_usage = 0
        print("\n🔁 Switching API...\n")

    if current_api_index >= len(GROQ_KEYS):
        print("❌ All API limits reached")
        exit()

    return Groq(api_key=GROQ_KEYS[current_api_index])

# ==============================
# EMAIL VALIDATION
# ==============================

def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email)

# ==============================
# PROGRESS SYSTEM
# ==============================

def load_progress():
    if not os.path.exists("progress.json"):
        return {
            "last_index": 0,
            "emails_sent_today": 0,
            "last_run_date": str(datetime.today().date())
        }

    with open("progress.json", "r") as f:
        data = json.load(f)

    if data["last_run_date"] != str(datetime.today().date()):
        data["emails_sent_today"] = 0
        data["last_run_date"] = str(datetime.today().date())

    return data

def save_progress(data):
    with open("progress.json", "w") as f:
        json.dump(data, f, indent=4)

# ==============================
# LOAD TEMPLATES
# ==============================

def load_templates():
    with open("templates.json", "r") as f:
        return json.load(f)

# ==============================
# FILE PICKER
# ==============================

def select_file():
    files = [
        f for f in os.listdir()
        if (f.endswith(".csv") or f.endswith(".xlsx")) and not f.startswith("_")
    ]

    if not files:
        print("❌ No CSV/XLSX files found")
        input("Press Enter to exit...")
        exit()

    print("\nSelect your data file:\n")
    for i, f in enumerate(files, 1):
        print(f"{i}. {f}")

    choice = int(input("\nEnter choice: "))
    return files[choice - 1]

# ==============================
# CLEAN DATA
# ==============================

def clean_data(df):
    df = df.astype(str)
    df.columns = df.columns.str.lower().str.strip()
    df = df.apply(lambda x: x.str.strip())
    df = df.dropna(how='all')
    df = df.drop_duplicates(subset=["email"])
    return df

# ==============================
# SAFE FILE LOADER
# ==============================

def load_file_safely(file):
    try:
        if file.endswith(".csv"):
            return pd.read_csv(file)
        else:
            try:
                return pd.read_excel(file, engine="openpyxl")
            except:
                print("⚠️ Excel corrupted → trying CSV fallback...")
                return pd.read_csv(file)
    except Exception as e:
        print(f"❌ File loading failed: {e}")
        input("Fix file and press Enter...")
        exit()

# ==============================
# AI ENHANCE
# ==============================

def enhance_with_ai(text):
    global current_api_usage
    client = get_groq_client()

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": text}]
        )
        current_api_usage += 1
        return response.choices[0].message.content
    except:
        print("[AI ERROR] Using template fallback")
        return text

# ==============================
# LOGGING
# ==============================

def log_entry(data):
    df = pd.DataFrame([data])
    if not os.path.exists("sent_log.csv"):
        df.to_csv("sent_log.csv", index=False)
    else:
        df.to_csv("sent_log.csv", mode='a', header=False, index=False)

# ==============================
# START SYSTEM
# ==============================

print("\n[1/5] Connecting...")
time.sleep(1)

print("[2/5] Loading modules...")
time.sleep(1)

print("[3/5] Connecting email server...")
yag = yagmail.SMTP(user=EMAIL, password=APP_PASSWORD)

print("[4/5] Loading templates...")
templates = load_templates()

print("[5/5] Ready...\n")

# ==============================
# MODE (ALWAYS ON)
# ==============================

mode = True

# ==============================
# FILE SELECTION
# ==============================

file = select_file()

# ==============================
# LOAD DATA
# ==============================

df = load_file_safely(file)
df = clean_data(df)

# ==============================
# VALIDATION
# ==============================

required = ["company", "hr_name", "email"]

if not all(col in df.columns for col in required):
    print("❌ Data format incorrect")
    print("Required: company, hr_name, email")
    input("Press Enter to exit...")
    exit()

# ==============================
# PROGRESS
# ==============================

progress = load_progress()
start_index = progress["last_index"]

print(f"\n🔁 Resuming from index {start_index}\n")

batch_count = 0

# ==============================
# MAIN LOOP
# ==============================

for i in range(start_index, len(df)):

    try:
        row = df.iloc[i]

        name = str(row["hr_name"]).strip()
        company = str(row["company"]).strip()
        email = str(row["email"]).strip()

        if not name or name.lower() == "nan":
            print("[ERROR] Name missing → skipped")
            continue

        if not company or company.lower() == "nan":
            print("[ERROR] Company missing → skipped")
            continue

        if not is_valid_email(email):
            print("[ERROR] Invalid email → skipped")
            continue

        template = templates[i % len(templates)]
        message = template.format(name=name, company=company)

        message = enhance_with_ai(message)

        subject = random.choice([
            f"Quick question regarding hiring at {company}",
            f"Regarding your hiring at {company}",
            f"Background verification for {company}"
        ])

        retry = 0
        success = False
        error_msg = ""

        while retry <= 2:
            try:
                print(f"📤 Sending to {email}")
                yag.send(to=email, subject=subject, contents=message)
                print("✅ Sent\n")
                success = True
                break
            except Exception as e:
                retry += 1
                error_msg = str(e)
                print(f"❌ Retry {retry}/2")

        status = "sent" if success else "failed"

        log_entry({
            "name": name,
            "email": email,
            "company": company,
            "status": status,
            "reason": error_msg,
            "retry_count": retry,
            "api_used": current_api_index,
            "timestamp": str(datetime.now())
        })

        progress["last_index"] = i + 1
        progress["emails_sent_today"] += 1
        save_progress(progress)

        batch_count += 1

        if batch_count >= 10:
            delay = random.randint(1500, 2100)
            print(f"\n⏸ Batch done. Waiting {delay//60} min...\n")
            time.sleep(delay)
            batch_count = 0

        delay = random.randint(10, 25)
        print(f"⏳ Waiting {delay}s...\n")
        time.sleep(delay)

    except Exception as e:
        print(f"[CRITICAL] Row {i} skipped → {e}")
        continue

print("\n🎉 Campaign Finished")