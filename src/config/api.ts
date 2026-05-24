/**
 * API Configuration
 * Handles API base URL for different environments
 */

// Determine the API base URL based on environment
const DEFAULT_PROD_API_URL = 'https://claritas-verify-api.onrender.com';

const getApiBaseUrl = (): string => {
  // Use explicit environment variable if provided.
  const envUrl = typeof import.meta.env.VITE_API_URL === 'string' ? import.meta.env.VITE_API_URL.trim() : '';
  if (envUrl) {
    return envUrl;
  }

  // Local development default.
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  // Production fallback.
  return DEFAULT_PROD_API_URL;
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * OTP API endpoints
 */
export const OTP_API = {
  sendOtp: `${API_BASE_URL}/api/send-otp`,
  verifyOtp: `${API_BASE_URL}/api/verify-otp`,
  checkVerification: `${API_BASE_URL}/api/check-verification`,
  clearVerification: `${API_BASE_URL}/api/clear-verification`,
  registerUser: `${API_BASE_URL}/api/register`,
};

// Feature flag: Hide auth UI and endpoints when set to 'true'
export const HIDE_AUTH: boolean = (import.meta.env.VITE_HIDE_AUTH === 'true');
/**
 * Generic API request helper with error handling
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type') || '';
    let data: unknown;
    let responseText: string | null = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        responseText = await response.text();
        console.error('Failed to parse JSON response:', jsonError, responseText);
        return {
          success: false,
          error: `Server returned invalid JSON${responseText ? `: ${responseText}` : ''}`,
        };
      }
    } else {
      responseText = await response.text();
      data = undefined;
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === 'object' && data !== null && 'message' in data && typeof (data as any).message === 'string'
          ? (data as any).message
          : responseText || `HTTP error ${response.status}`;

      return {
        success: false,
        error: errorMessage,
      };
    }

    return { success: true, data: data as T };
  } catch (error) {
    console.error('API request failed:', error);

    if (error instanceof TypeError) {
      return {
        success: false,
        error: 'Unable to connect to server. Please check your internet connection.',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * OTP Service functions
 */
export const otpService = {
  /**
   * Send OTP to email
   */
  async sendOtp(email: string): Promise<{
    success: boolean;
    message?: string;
    cooldown?: number;
    expiresIn?: number;
  }> {
    const result = await apiRequest<{
      success: boolean;
      message: string;
      cooldown?: number;
      expiresIn?: number;
    }>(OTP_API.sendOtp, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (result.success && result.data) {
      return result.data;
    }

    return {
      success: false,
      message: result.error || 'Failed to send OTP',
    };
  },

  /**
   * Verify OTP
   */
  async verifyOtp(email: string, otp: string): Promise<{
    success: boolean;
    message?: string;
    verified?: boolean;
  }> {
    const result = await apiRequest<{
      success: boolean;
      message: string;
      verified: boolean;
    }>(OTP_API.verifyOtp, {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });

    if (result.success && result.data) {
      return result.data;
    }

    return {
      success: false,
      message: result.error || 'Failed to verify OTP',
    };
  },

  /**
   * Check if email is verified
   */
  async checkVerification(email: string): Promise<boolean> {
    const result = await apiRequest<{ verified: boolean }>(
      OTP_API.checkVerification,
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );

    return result.success && result.data?.verified === true;
  },

  /**
   * Clear verification after successful registration
   */
  async clearVerification(email: string): Promise<void> {
    await apiRequest(OTP_API.clearVerification, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async registerUser(email: string, fullName: string, position: string, companyName: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    const result = await apiRequest<{ success: boolean; message: string }>(OTP_API.registerUser, {
      method: 'POST',
      body: JSON.stringify({ email, fullName, position, companyName }),
    });

    if (result.success && result.data) {
      return {
        success: result.data.success,
        message: result.data.message,
      };
    }

    return {
      success: false,
      message: result.error || 'Failed to register user',
    };
  },
};
