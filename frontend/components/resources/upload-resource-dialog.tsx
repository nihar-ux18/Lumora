"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceService, ResourceType } from "@/services/resource.service";
import { toast } from "sonner";
import { FileUp, Loader2, X, Link as LinkIcon, FileText, Image as ImageIcon, AlignLeft } from "lucide-react";
import { AxiosError, AxiosProgressEvent } from "axios";
import { motion } from "framer-motion";

const uploadSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(255, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional().or(z.literal("")),
  resource_type: z.enum(["pdf", "docx", "image", "url", "note"]),
  source_url: z.string().max(1000).url("Must be a valid URL").optional().or(z.literal("")),
  file: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.resource_type === "url" && !data.source_url) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "URL is required for URL resources",
      path: ["source_url"],
    });
  }
  if (["pdf", "docx", "image"].includes(data.resource_type) && (!data.file || data.file.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "File is required for this resource type",
      path: ["file"],
    });
  }
});

type UploadFormValues = z.infer<typeof uploadSchema>;

interface UploadResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export function UploadResourceDialog({ isOpen, onClose, workspaceId }: UploadResourceDialogProps) {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
      resource_type: "pdf",
      source_url: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const resourceType = watch("resource_type");
  const isFileType = ["pdf", "docx", "image"].includes(resourceType);

  const createMutation = useMutation({
    mutationFn: async (data: UploadFormValues) => {
      // 1. Create Resource Entry
      const payload = {
        title: data.title,
        description: data.description || null,
        resource_type: data.resource_type as ResourceType,
        source_url: data.resource_type === "url" ? data.source_url : null,
      };
      const resource = await resourceService.createResource(workspaceId, payload);

      // 2. Upload File if applicable
      if (isFileType && data.file && data.file.length > 0) {
        await resourceService.uploadResource(
          resource.id, 
          data.file[0],
          (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        );
      }
      return resource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", workspaceId] });
      toast.success("Resource added successfully");
      reset();
      setUploadProgress(0);
      onClose();
    },
    onError: (error: Error | AxiosError) => {
      let msg = "Failed to add resource";
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
      setUploadProgress(0);
    },
  });

  const onSubmit = (data: UploadFormValues) => {
    createMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => !createMutation.isPending && onClose()}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#4A00FF]/20 text-[#4A00FF]">
                <FileUp className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Add Resource</h2>
            </div>
            <button 
              onClick={onClose}
              disabled={createMutation.isPending}
              className="rounded-full p-2 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Resource Type</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: "pdf", icon: FileText, label: "PDF" },
                  { id: "docx", icon: FileText, label: "DOCX" },
                  { id: "image", icon: ImageIcon, label: "Image" },
                  { id: "url", icon: LinkIcon, label: "URL" },
                  { id: "note", icon: AlignLeft, label: "Note" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setValue("resource_type", type.id as "pdf" | "docx" | "image" | "url" | "note");
                    }}
                    disabled={createMutation.isPending}
                    className={`flex flex-col items-center justify-center py-3 rounded-[12px] border transition-colors ${
                      resourceType === type.id 
                        ? "bg-[#4A00FF]/20 border-[#4A00FF] text-[#4A00FF]" 
                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    } disabled:opacity-50`}
                  >
                    <type.icon className="h-4 w-4 mb-1.5" />
                    <span className="text-[10px] font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Title</label>
              <input
                {...register("title")}
                disabled={createMutation.isPending}
                className="w-full h-11 px-4 rounded-[12px] bg-[#1A1A1D] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50"
                placeholder="e.g. Physics Chapter 4"
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
            </div>

            {resourceType === "url" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">URL</label>
                <input
                  {...register("source_url")}
                  disabled={createMutation.isPending}
                  className="w-full h-11 px-4 rounded-[12px] bg-[#1A1A1D] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50"
                  placeholder="https://example.com/article"
                />
                {errors.source_url && <p className="text-xs text-red-400">{errors.source_url.message}</p>}
              </div>
            )}

            {isFileType && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">File Upload</label>
                <input
                  type="file"
                  {...register("file")}
                  disabled={createMutation.isPending}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-sm file:font-semibold file:bg-[#4A00FF]/20 file:text-[#4A00FF] hover:file:bg-[#4A00FF]/30 transition-colors disabled:opacity-50"
                  accept={
                    resourceType === "pdf" ? ".pdf" :
                    resourceType === "docx" ? ".docx" :
                    "image/*"
                  }
                />
                {errors.file && <p className="text-xs text-red-400">{errors.file.message as string}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {resourceType === "note" ? "Content" : "Description (Optional)"}
              </label>
              <textarea
                {...register("description")}
                disabled={createMutation.isPending}
                className="w-full min-h-[100px] p-4 rounded-[12px] bg-[#1A1A1D] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors resize-none disabled:opacity-50"
                placeholder={resourceType === "note" ? "Write your note here..." : "Add a short description..."}
              />
              {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
            </div>

            {createMutation.isPending && isFileType && uploadProgress > 0 && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#4A00FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={createMutation.isPending}
                className="px-4 py-2 rounded-[10px] bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 rounded-[10px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isFileType ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  "Add Resource"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
