const API_URL = import.meta.env.VITE_API_URL || 'https://claritas-verify-api.onrender.com';

interface SendOtpResponse {
  success: boolean;
  expiresIn: number;
  cooldown: number;
  message: string;
}

interface VerifyOtpResponse {
  success: boolean;
  verified: boolean;
  message?: string;
}

export const otpService = {

  async sendOtp(email: string): Promise<SendOtpResponse> {
    const res = await fetch(`${API_URL}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return {
      success: data.success ?? false,
      expiresIn: data.expires_in ?? 300,
      cooldown: data.cooldown ?? 60,
      message: data.message ?? '',
    };
  },

  async verifyOtp(email: string, code: string): Promise<VerifyOtpResponse> {
    const res = await fetch(`${API_URL}/api/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: code }),
    });
    const data = await res.json();
    return {
      success: data.success ?? false,
      verified: data.verified ?? false,
      message: data.message,
    };
  },

  async clearVerification(email: string) {
    await fetch(`${API_URL}/api/clear-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return { success: true };
  },
};