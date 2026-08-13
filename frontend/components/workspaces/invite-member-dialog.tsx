"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { toast } from "sonner";
import { UserPlus, Loader2, X, Mail, Copy, Check } from "lucide-react";
import axios from "axios";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof inviteSchema>;

export function InviteMemberDialog({ isOpen, onClose, workspaceId }: InviteMemberDialogProps) {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Prevent SSR hydration mismatches
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "" },
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;

  const mutation = useMutation({
    mutationFn: (email: string) => workspaceService.inviteMember(workspaceId, { email }),
    onSuccess: (data) => {
      toast.success("Invitation generated");
      const url = new URL(window.location.origin);
      url.pathname = "/invitations/accept";
      url.searchParams.set("token", data.token);
      setInvitationLink(url.toString());
      queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.detail || "Failed to invite member");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values.email);
  };

  const handleCopy = async () => {
    if (!invitationLink) return;
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleClose = () => {
    reset();
    setInvitationLink(null);
    onClose();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] sm:w-full sm:max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px] bg-[#0A0A0B] border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-[#4A00FF]" />
                Invite Member
              </h2>
              <button
                onClick={handleClose}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!invitationLink ? (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-foreground">
                      Email Address
                    </label>
                    <div className="relative flex items-center rounded-[12px] bg-[#131316] border border-white/10 px-3.5 py-2.5 focus-within:border-[#4A00FF]/60 transition-colors">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5" />
                      <input
                        id="email"
                        type="email"
                        placeholder="colleague@example.com"
                        className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                        {...register("email")}
                        disabled={mutation.isPending}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] font-medium text-red-400 pl-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={mutation.isPending}
                    className="rounded-[10px] px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="relative flex items-center justify-center rounded-[10px] bg-[#4A00FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5A14FF] transition-colors shadow-lg shadow-[#4A00FF]/25 disabled:opacity-70 min-w-[120px]"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Generate Link"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The invitation has been created. Share this secure link with the invited user to grant them access to this workspace.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-[12px] bg-[#131316] border border-white/10 p-2 pl-3">
                  <div className="flex-1 overflow-x-auto no-scrollbar">
                    <p className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {invitationLink}
                    </p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-2 rounded-[8px] bg-white/10 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/15 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleClose}
                    className="rounded-[10px] bg-white/10 px-4 py-2 text-xs font-medium text-foreground hover:bg-white/15 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
