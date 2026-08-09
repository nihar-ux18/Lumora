"use client";

import { useEffect, useRef, useState } from "react";
import { authService } from "@/services/auth.service";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const calledRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resendEmail, setResendEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setErrorMessage("Missing verification token.");
      return;
    }

    if (calledRef.current) return;
    calledRef.current = true;

    authService.verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        if (axios.isAxiosError(error) && error.response?.data?.detail) {
          const detail = error.response.data.detail;
          setErrorMessage(Array.isArray(detail) ? detail.map((e: { msg: string }) => e.msg).join(", ") : detail);
        } else {
          setErrorMessage("Failed to verify email. The token may be invalid or expired.");
        }
      });
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResendStatus("loading");
    setResendMessage("");
    try {
      await authService.resendVerification({ email: resendEmail });
      setResendStatus("success");
      setResendMessage("Verification email sent! Please check your inbox.");
    } catch (error) {
      setResendStatus("error");
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        const detail = error.response.data.detail;
        setResendMessage(Array.isArray(detail) ? detail.map((e: { msg: string }) => e.msg).join(", ") : detail);
      } else {
        setResendMessage("Failed to send verification email. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-6">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 text-[#4A00FF] animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying your email address...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <p className="text-sm text-muted-foreground">
            Your email has been successfully verified! You can now access all Lumora features.
          </p>
          <Link 
            href="/dashboard"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors mt-4"
          >
            Go to Dashboard
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-12 w-12 text-red-500" />
          <p className="text-sm text-red-400 mb-2">{errorMessage}</p>
          
          <div className="w-full p-4 rounded-[16px] bg-white/5 border border-white/10 text-left mt-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Need a new link?</h3>
            <p className="text-xs text-muted-foreground mb-4">Enter your email address to receive a new verification link.</p>
            <form onSubmit={handleResend} className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                disabled={resendStatus === "loading" || resendStatus === "success"}
                className="w-full h-10 px-3 rounded-[10px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={resendStatus === "loading" || resendStatus === "success" || !resendEmail}
                className="w-full h-10 flex items-center justify-center gap-2 rounded-[10px] bg-white/10 text-sm font-medium text-white hover:bg-white/15 transition-colors disabled:opacity-50"
              >
                {resendStatus === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resend Verification Email"}
              </button>
            </form>
            {resendMessage && (
              <p className={`text-xs mt-3 ${resendStatus === "success" ? "text-green-400" : "text-red-400"}`}>
                {resendMessage}
              </p>
            )}
          </div>

          <Link 
            href="/auth/login"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-[12px] bg-transparent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            Return to Login
          </Link>
        </>
      )}
    </div>
  );
}
