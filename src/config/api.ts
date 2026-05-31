const API_URL = import.meta.env.VITE_API_URL || 'https://claritas-verify-api.onrender.com';

export const otpService = {

  sendOtp: async (email: string) => {
    const res = await fetch(`${API_URL}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await fetch(`${API_URL}/api/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return res.json();
  },

  registerUser: async (email: string, fullName: string, position: string, companyName: string) => {
    // localStorage mein save karo (ya Firebase mein)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({ email, fullName, position, companyName });
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true };
  },

  clearVerification: async (email: string) => {
    await fetch(`${API_URL}/api/clear-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return { success: true };
  },
};