export const otpService = {
  sendOtp: async (email: string) => {
    console.log('OTP sent to:', email);

    return {
      success: true,
      expiresIn: 300,
    };
  },

  verifyOtp: async (email: string, otp: string) => {
    console.log('Verifying OTP:', email, otp);

    // Demo OTP
    if (otp === '123456') {
      return {
        success: true,
        verified: true,
      };
    }

    return {
      success: false,
      verified: false,
      message: 'Invalid OTP',
    };
  },

  registerUser: async (
    email: string,
    fullName: string,
    position: string,
    companyName: string
  ) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    users.push({
      email,
      fullName,
      position,
      companyName,
    });

    localStorage.setItem('users', JSON.stringify(users));

    return {
      success: true,
    };
  },

  clearVerification: async (email: string) => {
    console.log('Verification cleared for:', email);

    return {
      success: true,
    };
  },
};