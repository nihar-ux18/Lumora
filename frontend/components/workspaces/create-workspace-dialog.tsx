"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService, WorkspaceCreate } from "@/services/workspace.service";
import { toast } from "sonner";
import { FolderPlus, Loader2, X, AlignLeft } from "lucide-react";
import axios, { AxiosError } from "axios";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Genuinely required to prevent Next.js SSR hydration mismatches while avoiding React 18 synchronous render warnings
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
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      reset();
      onClose();
    },
    onError: (error: Error | AxiosError) => {
      let msg = "Failed to create workspace";
      if (axios.isAxiosError(error) && error.response?.data) {
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

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px] bg-[#0A0A0B] border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="text-sm font-semibold tracking-wide text-foreground flex items-center gap-2">
                <FolderPlus className="h-4 w-4 text-[#4A00FF]" />
                Create Workspace
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-foreground">
                    Workspace Name
                  </label>
                  <div className="relative flex items-center rounded-[12px] bg-[#131316] border border-white/10 px-3.5 py-2.5 focus-within:border-[#4A00FF]/60 transition-colors">
                    <input
                      id="name"
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
                  <label htmlFor="description" className="text-xs font-medium text-foreground">
                    Description (Optional)
                  </label>
                  <div className="relative flex items-start rounded-[12px] bg-[#131316] border border-white/10 px-3.5 py-2.5 focus-within:border-[#4A00FF]/60 transition-colors">
                    <AlignLeft className="h-4 w-4 text-muted-foreground shrink-0 mr-2.5 mt-0.5" />
                    <textarea
                      id="description"
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
                    "Create Workspace"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
