"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { toast } from "sonner";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface DeleteWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceName: string;
}

export function DeleteWorkspaceDialog({ 
  isOpen, 
  onClose, 
  workspaceId, 
  workspaceName 
}: DeleteWorkspaceDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => workspaceService.deleteWorkspace(workspaceId),
    onSuccess: () => {
      toast.success("Workspace deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      onClose();
      router.push("/workspaces");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete workspace"));
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md p-0 overflow-hidden rounded-[20px] bg-[#0A0A0B] border border-red-500/20 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <DialogTitle className="text-sm font-semibold tracking-wide text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Delete Workspace
          </DialogTitle>
          <button
            onClick={onClose}
            disabled={mutation.isPending}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-foreground mb-4 leading-relaxed">
            Are you sure you want to delete <strong className="text-white">&quot;{workspaceName}&quot;</strong>?
          </p>
          <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
            This action is permanent and cannot be undone. All resources, chats, and configurations within this workspace will be permanently removed.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-[10px] px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
            >
              Cancel
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="relative flex items-center justify-center rounded-[10px] bg-red-500/10 border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20 hover:border-red-500/30 transition-colors disabled:opacity-50 min-w-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Workspace"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
