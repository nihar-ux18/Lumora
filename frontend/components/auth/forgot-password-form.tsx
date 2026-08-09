"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (emailStr: string) => authService.forgotPassword({ email: emailStr }),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Password reset link sent to your email.");
    },
    onError: (error) => {
      let msg = "Failed to send reset link";
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
    if (!email.trim()) return;
    mutation.mutate(email);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="text-sm text-muted-foreground">
          If an account with that email exists, a password reset link has been sent. Please check your inbox.
        </div>
        <Link 
          href="/auth/login"
          className="text-sm font-medium text-[#4A00FF] hover:text-[#5A14FF] transition-colors"
        >
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-11 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending || !email.trim()}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50 mt-6"
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span>Send reset link</span>
        )}
        {!mutation.isPending && <ArrowRight className="h-4 w-4" />}
      </button>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Remember your password? </span>
        <Link 
          href="/auth/login" 
          className="font-medium text-[#4A00FF] hover:text-[#5A14FF] transition-colors"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
