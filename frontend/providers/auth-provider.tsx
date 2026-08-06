"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, LoginRequest, RegisterRequest } from "@/services/auth.service";
import { UserResponse } from "@/types/auth";
import { ACCESS_TOKEN_KEY } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  
  // To avoid hydration mismatch and premature redirects, wait for mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: currentUser = null, isLoading: isUserLoading, refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
      if (!token) return null;
      
      try {
        return await authService.getMe();
      } catch (error) {
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
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      }
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || "Invalid email or password";
      toast.error(message);
      throw error;
    }
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success("Account created successfully. Please sign in.");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || "Registration failed";
      toast.error(message);
      throw error;
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch (error) {
        // Continue with local logout even if server logout fails
        console.error("Server logout failed", error);
      }
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
