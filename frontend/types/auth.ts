export interface User {
  id: string;
  fullname: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  fullname: string;
  email: string;
  avatar_url?: string | null;
  role?: string;
  is_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
  email_error?: string | null;
}