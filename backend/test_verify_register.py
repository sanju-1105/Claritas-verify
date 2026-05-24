import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:5000"

def post(path, payload):
    url = f"{BASE_URL}{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

if __name__ == "__main__":
    email = "devtest@example.com"
    otp = "935116"

    print("Sending verify request...")
    verify_resp = post("/api/verify-otp", {"email": email, "otp": otp})
    print("VERIFY RESPONSE:", json.dumps(verify_resp, indent=2))

    if verify_resp.get("success"):
        print("Sending register request...")
        register_resp = post("/api/register", {
            "email": email,
            "fullName": "Dev Test",
            "position": "QA",
            "companyName": "Claritas Verify"
        })
        print("REGISTER RESPONSE:", json.dumps(register_resp, indent=2))
    else:
        print("Verification failed, not registering.")
