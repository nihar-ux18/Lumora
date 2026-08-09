"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, LoginRequest, RegisterRequest } from "@/services/auth.service";
import { UserResponse } from "@/types/auth";
import { ACCESS_TOKEN_KEY } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const isMockAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true";
const MOCK_TOKEN = "development-mock-token";

const mockUser: UserResponse = {
  id: "mock-user-id",
  fullname: "Nihar Patil",
  email: "nihar@example.com",
  role: "user",
  is_verified: true,
  is_active: true,
  created_at: new Date().toISOString(),
};

interface AuthContextType {
  currentUser: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Genuinely required to prevent Next.js SSR hydration mismatches while avoiding React 18 synchronous render warnings
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { data: currentUser = null, isLoading: isUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
      if (!token) return null;
      
      if (isMockAuthEnabled && token === MOCK_TOKEN) {
        return mockUser;
      }
      
      try {
        return await authService.getMe();
      } catch {
        if (typeof window !== "undefined") {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: mounted,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      if (isMockAuthEnabled) {
        // DEVELOPMENT ONLY: Hardcoded mock credentials
        if (data.email === "demo@lumora.dev" && data.password === "LumoraDemo123!") {
          return { access_token: MOCK_TOKEN, token_type: "bearer" };
        }
        throw new Error("Invalid mock credentials");
      }
      return await authService.login(data);
    },
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      let message = "Invalid email or password";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || message;
      }
      toast.error(message);
      throw error;
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      if (isMockAuthEnabled) {
        return { message: "Mock registration successful" };
      }
      return await authService.register(data);
    },
    onSuccess: () => {
      toast.success("Account created successfully. Please sign in.");
      router.push("/auth/login");
    },
    onError: (error: unknown) => {
      let message = "Registration failed";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || message;
      }
      toast.error(message);
      throw error;
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Local logout only, no backend endpoint exists
      return Promise.resolve();
    },
    onSettled: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    }
  });

  const value = {
    currentUser,
    isLoading: !mounted || isUserLoading,
    isAuthenticated: !!currentUser,
    login: async (data: LoginRequest) => {
      await loginMutation.mutateAsync(data);
    },
    register: async (data: RegisterRequest) => {
      await registerMutation.mutateAsync(data);
    },
    logout: () => {
      logoutMutation.mutate();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
