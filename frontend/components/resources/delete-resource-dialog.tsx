"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceService } from "@/services/resource.service";
import { toast } from "sonner";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { AxiosError } from "axios";
import { motion } from "framer-motion";

interface DeleteResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceTitle: string;
  workspaceId: string;
}

export function DeleteResourceDialog({ 
  isOpen, 
  onClose, 
  resourceId, 
  resourceTitle,
  workspaceId 
}: DeleteResourceDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => resourceService.deleteResource(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", workspaceId] });
      toast.success("Resource deleted successfully");
      onClose();
    },
    onError: (error: Error | AxiosError) => {
      let msg = "Failed to delete resource";
      if ("response" in error && error.response?.data) {
        const data = error.response.data as { detail?: unknown };
        const detail = data.detail;
        if (Array.isArray(detail)) {
          msg = detail.map((err: { msg: string }) => err.msg).join(", ");
        } else if (typeof detail === "string") {
          msg = detail;
        }
      } else {
        msg = error.message || msg;
      }
      toast.error(msg);
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => !deleteMutation.isPending && onClose()}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-[20px] bg-[#131316] border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-red-500/20 text-red-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Delete Resource</h2>
            </div>
            <button 
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="rounded-full p-2 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-foreground">{resourceTitle}</strong>? 
              This action cannot be undone, and the resource will be permanently removed from this workspace.
            </p>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 rounded-[10px] bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-[10px] bg-red-500 text-sm font-medium text-white shadow-lg shadow-red-500/25 hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Resource"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
