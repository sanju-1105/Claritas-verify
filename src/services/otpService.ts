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

    console.log("Sending OTP to:", email);

    return {
      success: true,
      expiresIn: 300,
      cooldown: 60,
      message: "OTP sent successfully",
    };
  },

  async verifyOtp(
    email: string,
    code: string
  ): Promise<VerifyOtpResponse> {

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