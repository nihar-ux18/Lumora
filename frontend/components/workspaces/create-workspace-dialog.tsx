"use client";

import { useEffect, useState, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService, WorkspaceCreate } from "@/services/workspace.service";
import { toast } from "sonner";
import { FolderPlus, Loader2, X, AlignLeft } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useRouter } from "next/navigation";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  description: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof createWorkspaceSchema>;

export function CreateWorkspaceDialog({ isOpen, onClose }: CreateWorkspaceDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const nameId = useId();
  const descriptionId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent SSR hydration mismatches
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;

  const mutation = useMutation({
    mutationFn: (data: WorkspaceCreate) => workspaceService.createWorkspace(data),
    onSuccess: (data) => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      reset();
      onClose();
      router.push(`/workspaces/${data.id}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create workspace"));
    }
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md p-0 overflow-hidden rounded-[20px] bg-[#0A0A0B] border border-white/10 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <DialogTitle className="text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
            <FolderPlus className="h-4 w-4 text-[#4A00FF]" />
            Create Workspace
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor={nameId} className="text-xs font-medium text-foreground">
                Workspace Name
              </label>
              <div className="relative flex items-center rounded-[12px] bg-[#131316] border border-white/10 px-3.5 py-2.5 focus-within:border-[#4A00FF]/60 transition-colors">
                <input
                  id={nameId}
                  type="text"
                  placeholder="e.g. Q3 Marketing Strategy"
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  {...register("name")}
                  disabled={mutation.isPending}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] font-medium text-red-400 pl-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={descriptionId} className="text-xs font-medium text-foreground">
                Description (Optional)
              </label>
              <div className="relative flex items-start rounded-[12px] bg-[#131316] border border-white/10 px-3.5 py-2.5 focus-within:border-[#4A00FF]/60 transition-colors">
                <AlignLeft className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5 mt-0.5" />
                <textarea
                  id={descriptionId}
                  placeholder="Briefly describe the purpose of this workspace..."
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[80px] resize-none"
                  {...register("description")}
                  disabled={mutation.isPending}
                />
              </div>
              {errors.description && (
                <p className="text-[11px] font-medium text-red-400 pl-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
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
                "Create Workspace"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
