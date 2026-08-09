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
          <p className="text-sm text-red-400">{errorMessage}</p>
          <Link 
            href="/auth/login"
            className="w-full h-11 flex items-center justify-center gap-2 rounded-[12px] bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors mt-4"
          >
            Return to Login
          </Link>
        </>
      )}
    </div>
  );
}
