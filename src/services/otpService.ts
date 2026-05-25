export const otpService = {
  async sendOtp(email: string) {
    console.log("Sending OTP to:", email);

    return {
      success: true,
      expiresIn: 300,
      message: "OTP sent successfully",
    };
  },

  async verifyOtp(email: string, code: string) {
    console.log("Verifying OTP:", email, code);

    // Demo OTP = 123456
    if (code === "123456") {
      return {
        success: true,
        verified: true,
      };
    }

    return {
      success: false,
      verified: false,
      message: "Invalid OTP",
    };
  },

  async clearVerification(email: string) {
    console.log("Verification cleared:", email);

    return {
      success: true,
    };
  },
};