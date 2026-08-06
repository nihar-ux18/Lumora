import { apiClient } from "@/lib/api-client";
import { AUTH, USERS } from "@/constants";
import { User, TokenResponse, UserResponse } from "@/types/auth"; // Assume these match backend

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post(AUTH.REGISTER, data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await apiClient.post(AUTH.LOGIN, data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.get(AUTH.VERIFY_EMAIL, {
      params: { token },
    });
    return response.data;
  },

  resendVerification: async (data: ResendVerificationRequest) => {
    const response = await apiClient.post(AUTH.RESEND_VERIFICATION, data);
    return response.data;
  },

  refreshToken: async (data: RefreshTokenRequest) => {
    const response = await apiClient.post(AUTH.REFRESH, data);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get(AUTH.ME);
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await apiClient.get(AUTH.ADMIN);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await apiClient.post(AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post(AUTH.RESET_PASSWORD, data);
    return response.data;
  },
};
