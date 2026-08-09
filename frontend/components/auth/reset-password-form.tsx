"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (newPassword: string) => authService.resetPassword({ token, new_password: newPassword }),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Password reset successfully.");
    },
    onError: (error) => {
      let msg = "Failed to reset password";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        msg = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map((e: { msg: string }) => e.msg).join(", ") 
          : error.response.data.detail;
      }
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Missing reset token.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    mutation.mutate(password);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="text-sm text-muted-foreground">
          Your password has been reset successfully.
        </div>
        <Link 
          href="/auth/login"
          className="w-full h-11 flex items-center justify-center gap-2 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors"
        >
          Sign in to your account
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="text-sm text-red-400">
          Invalid or missing reset token. Please request a new password reset link.
        </div>
        <Link 
          href="/auth/forgot-password"
          className="text-sm font-medium text-[#4A00FF] hover:text-[#5A14FF] transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          New password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full h-11 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full h-11 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending || !password || !confirmPassword}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50 mt-6"
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span>Reset password</span>
        )}
        {!mutation.isPending && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
