"use client";

import { Suspense, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { toast } from "sonner";
import axios from "axios";
import { ShieldCheck, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const token = searchParams.get("token");
  const [hasAttempted, setHasAttempted] = useState(false);
  const [successWorkspaceId, setSuccessWorkspaceId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (tokenStr: string) => workspaceService.acceptInvitation({ token: tokenStr }),
    onSuccess: (data) => {
      toast.success("Invitation accepted successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setSuccessWorkspaceId(data.workspace_id);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.detail || "Failed to accept invitation");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
    onSettled: () => setHasAttempted(true),
  });

  const handleAccept = () => {
    if (!token) return;
    mutation.mutate(token);
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Invalid Invitation Link</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm">
          No invitation token was found in the URL. Please make sure you copied the full link.
        </p>
        <Link 
          href="/workspaces"
          className="rounded-[10px] bg-white/10 px-6 py-2.5 text-sm font-medium text-foreground hover:bg-white/15 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (successWorkspaceId) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <ShieldCheck className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">Welcome to the Workspace</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm">
          You have successfully joined the workspace and can now collaborate with the team.
        </p>
        <Link 
          href={`/workspaces/${successWorkspaceId}`}
          className="flex items-center gap-2 rounded-[12px] bg-[#4A00FF] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-all hover:gap-3"
        >
          Enter Workspace <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-full bg-[#4A00FF]/10 flex items-center justify-center mb-6">
        <ShieldCheck className="h-8 w-8 text-[#4A00FF]" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">Workspace Invitation</h2>
      
      {mutation.isError && hasAttempted ? (
        <div className="mb-8">
          <p className="text-sm text-red-400 mb-6 max-w-sm">
            This invitation could not be accepted. It may have expired or already been used.
          </p>
          <Link 
            href="/workspaces"
            className="rounded-[10px] bg-white/10 px-6 py-2.5 text-sm font-medium text-foreground hover:bg-white/15 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="mb-8 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-8 max-w-sm">
            You have been invited to join a Lumora workspace. Click below to securely accept the invitation and link it to your account.
          </p>
          <button 
            onClick={handleAccept}
            disabled={mutation.isPending}
            className="flex items-center justify-center gap-2 rounded-[12px] bg-[#4A00FF] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-70 min-w-[200px]"
          >
            {mutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Accept Invitation"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <div className="mx-auto w-full max-w-3xl min-h-[60vh] flex items-center justify-center">
          <div className="w-full rounded-[24px] bg-[#131316]/60 border border-white/10 p-8 md:p-12 backdrop-blur-[20px] shadow-2xl">
            <Suspense fallback={<div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#4A00FF]" /></div>}>
              <AcceptInvitationContent />
            </Suspense>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
