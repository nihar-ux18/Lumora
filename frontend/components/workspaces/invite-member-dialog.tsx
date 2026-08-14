"use client";

import { useEffect, useState, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { toast } from "sonner";
import { UserPlus, Loader2, X, Mail, Copy, Check } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

  const emailId = useId();

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
      toast.error(getErrorMessage(error, "Failed to invite member"));
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md p-0 overflow-hidden rounded-[20px] bg-[#0A0A0B] border border-white/10 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <DialogTitle className="text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[#4A00FF]" />
            Invite Member
          </DialogTitle>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!invitationLink ? (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor={emailId} className="text-xs font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-[12px] bg-[#131316] border border-white/10 px-3.5 py-2.5 focus-within:border-[#4A00FF]/60 transition-colors">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5" />
                  <input
                    id={emailId}
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
                className="rounded-[10px] px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="relative flex items-center justify-center rounded-[10px] bg-[#4A00FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5A14FF] transition-colors shadow-lg shadow-[#4A00FF]/25 disabled:opacity-70 min-w-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
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
                className="shrink-0 flex items-center gap-2 rounded-[8px] bg-white/10 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="rounded-[10px] bg-white/10 px-4 py-2 text-xs font-medium text-foreground hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
