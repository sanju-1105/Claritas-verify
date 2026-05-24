"""
OTP Storage Module
Handles in-memory OTP storage with expiration and rate limiting
"""

import time
import random
import string
from typing import Optional, Dict, Tuple
from dataclasses import dataclass
from threading import Lock

@dataclass
class OTPRecord:
    otp: str
    email: str
    created_at: float
    attempts: int = 0
    verified: bool = False

class OTPStore:
    """Thread-safe in-memory OTP storage with expiration and rate limiting"""
    
    def __init__(
        self,
        otp_length: int = 6,
        expiry_seconds: int = 300,  # 5 minutes
        max_attempts: int = 5,
        cooldown_seconds: int = 60,  # 1 minute between resends
        max_requests_per_hour: int = 10
    ):
        self._store: Dict[str, OTPRecord] = {}
        self._send_timestamps: Dict[str, list] = {}  # Rate limiting
        self._lock = Lock()
        self.otp_length = otp_length
        self.expiry_seconds = expiry_seconds
        self.max_attempts = max_attempts
        self.cooldown_seconds = cooldown_seconds
        self.max_requests_per_hour = max_requests_per_hour
    
    def _generate_otp(self) -> str:
        """Generate a random numeric OTP"""
        return ''.join(random.choices(string.digits, k=self.otp_length))
    
    def _clean_expired(self) -> None:
        """Remove expired OTP records"""
        current_time = time.time()
        expired_emails = [
            email for email, record in self._store.items()
            if current_time - record.created_at > self.expiry_seconds
        ]
        for email in expired_emails:
            del self._store[email]
    
    def _clean_old_timestamps(self, email: str) -> None:
        """Remove timestamps older than 1 hour for rate limiting"""
        if email in self._send_timestamps:
            current_time = time.time()
            self._send_timestamps[email] = [
                ts for ts in self._send_timestamps[email]
                if current_time - ts < 3600
            ]
    
    def can_send_otp(self, email: str) -> Tuple[bool, Optional[str], Optional[int]]:
        """
        Check if OTP can be sent to this email
        Returns: (can_send, error_message, wait_seconds)
        """
        email = email.lower().strip()
        current_time = time.time()
        
        with self._lock:
            self._clean_expired()
            self._clean_old_timestamps(email)
            
            # Check cooldown (time since last OTP sent)
            if email in self._store:
                time_since_last = current_time - self._store[email].created_at
                if time_since_last < self.cooldown_seconds:
                    wait_time = int(self.cooldown_seconds - time_since_last)
                    return False, f"Please wait {wait_time} seconds before requesting a new OTP", wait_time
            
            # Check hourly rate limit
            if email in self._send_timestamps:
                if len(self._send_timestamps[email]) >= self.max_requests_per_hour:
                    return False, "Too many OTP requests. Please try again later.", None
            
            return True, None, None
    
    def create_otp(self, email: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Create a new OTP for the given email
        Returns: (otp, error_message)
        """
        email = email.lower().strip()
        
        can_send, error_msg, _ = self.can_send_otp(email)
        if not can_send:
            return None, error_msg
        
        with self._lock:
            otp = self._generate_otp()
            
            # Store OTP record
            self._store[email] = OTPRecord(
                otp=otp,
                email=email,
                created_at=time.time()
            )
            
            # Track send timestamp for rate limiting
            if email not in self._send_timestamps:
                self._send_timestamps[email] = []
            self._send_timestamps[email].append(time.time())
            
            return otp, None
    
    def verify_otp(self, email: str, otp: str) -> Tuple[bool, str]:
        """
        Verify OTP for the given email
        Returns: (success, message)
        """
        email = email.lower().strip()
        otp = otp.strip()
        
        with self._lock:
            self._clean_expired()
            
            # Check if OTP exists for this email
            if email not in self._store:
                return False, "OTP expired or not found. Please request a new OTP."
            
            record = self._store[email]
            
            # Check if already verified
            if record.verified:
                return True, "Email already verified"
            
            # Check max attempts
            if record.attempts >= self.max_attempts:
                del self._store[email]
                return False, "Too many failed attempts. Please request a new OTP."
            
            # Check expiration
            if time.time() - record.created_at > self.expiry_seconds:
                del self._store[email]
                return False, "OTP has expired. Please request a new OTP."
            
            # Verify OTP
            record.attempts += 1
            
            if record.otp == otp:
                record.verified = True
                return True, "Email verified successfully"
            else:
                remaining = self.max_attempts - record.attempts
                return False, f"Invalid OTP. {remaining} attempts remaining."
    
    def is_verified(self, email: str) -> bool:
        """Check if email has been verified"""
        email = email.lower().strip()
        with self._lock:
            if email in self._store:
                return self._store[email].verified
            return False
    
    def get_remaining_time(self, email: str) -> Optional[int]:
        """Get remaining time in seconds for OTP validity"""
        email = email.lower().strip()
        with self._lock:
            if email in self._store:
                elapsed = time.time() - self._store[email].created_at
                remaining = self.expiry_seconds - elapsed
                return max(0, int(remaining))
            return None
    
    def clear_verified(self, email: str) -> None:
        """Clear verified OTP record after successful registration"""
        email = email.lower().strip()
        with self._lock:
            if email in self._store:
                del self._store[email]


# Global OTP store instance
otp_store = OTPStore()
