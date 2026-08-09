"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { workspaceService } from "@/services/workspace.service";
import { AppShell } from "@/components/app-shell";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

import { Suspense } from "react";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setErrorMessage("Missing invitation token.");
      return;
    }

    if (!isAuthenticated) {
      // Redirect to login, preserving the token in the redirect URL
      const redirectPath = `/invitations/accept?token=${token}`;
      const loginUrl = `/auth/login?${new URLSearchParams({ redirect: redirectPath }).toString()}`;
      router.push(loginUrl);
      return;
    }

    if (calledRef.current) return;
    calledRef.current = true;

    workspaceService.acceptInvitation({ token })
      .then(() => {
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        if (axios.isAxiosError(error) && error.response?.data?.detail) {
          const detail = error.response.data.detail;
          setErrorMessage(Array.isArray(detail) ? detail.map((e: { msg: string }) => e.msg).join(", ") : detail);
        } else {
          setErrorMessage("Failed to accept invitation. It may be invalid or expired.");
        }
      });
  }, [isAuthLoading, isAuthenticated, token, router]);

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-[20px] bg-[#131316]/60 border border-white/10 backdrop-blur-[20px] text-center space-y-6">
        {status === "loading" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4A00FF]/10">
              <Loader2 className="h-8 w-8 text-[#4A00FF] animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Accepting Invitation</h2>
            <p className="text-sm text-muted-foreground">Please wait while we process your invitation...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Invitation Accepted!</h2>
            <p className="text-sm text-muted-foreground">
              You have successfully joined the workspace.
            </p>
            <Link 
              href="/workspaces"
              className="mt-6 flex w-full items-center justify-center gap-2 h-11 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors"
            >
              Go to Workspaces
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Invalid Invitation</h2>
            <p className="text-sm text-red-400">{errorMessage}</p>
            <Link 
              href="/workspaces"
              className="mt-6 flex w-full items-center justify-center gap-2 h-11 rounded-[12px] bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Return to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#4A00FF] animate-spin" />
        </div>
      }>
        <AcceptInvitationContent />
      </Suspense>
    </AppShell>
  );
}
