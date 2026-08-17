"use client";

import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceService, ResourceType } from "@/services/resource.service";
import { toast } from "sonner";
import { FileUp, Loader2, X, Link as LinkIcon, FileText, Image as ImageIcon, AlignLeft } from "lucide-react";
import { type AxiosProgressEvent } from "axios";
import { getErrorMessage } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const uploadSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(255, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional().or(z.literal("")),
  resource_type: z.enum(["pdf", "docx", "image", "url", "note"]),
  source_url: z.string().max(1000).url("Must be a valid URL").optional().or(z.literal("")),
  file: z.custom<FileList>().optional(),
}).superRefine((data, ctx) => {
  if (data.resource_type === "url" && !data.source_url) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "URL is required for URL resources",
      path: ["source_url"],
    });
  }
  if (["pdf", "docx", "image"].includes(data.resource_type)) {
    if (!data.file || data.file.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File is required for this resource type",
        path: ["file"],
      });
    } else {
      const file = data.file[0];

      // 1. File Size Validation (Max 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File size must not exceed 10 MB",
          path: ["file"],
        });
      }

      // 2. File Type / Extension Validation
      const fileNameLower = file.name.toLowerCase();
      if (data.resource_type === "pdf") {
        const isPdf = file.type === "application/pdf" || fileNameLower.endsWith(".pdf");
        if (!isPdf) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only PDF files are allowed for PDF resource type",
            path: ["file"],
          });
        }
      } else if (data.resource_type === "docx") {
        const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileNameLower.endsWith(".docx");
        if (!isDocx) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only DOCX files are allowed for DOCX resource type",
            path: ["file"],
          });
        }
      } else if (data.resource_type === "image") {
        const isImage = file.type.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp", ".gif"].some(ext => fileNameLower.endsWith(ext));
        if (!isImage) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only image files are allowed for Image resource type",
            path: ["file"],
          });
        }
      }
    }
  }
});

type UploadFormValues = z.infer<typeof uploadSchema>;

interface UploadResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export function UploadResourceDialog({ isOpen, onClose, workspaceId }: UploadResourceDialogProps) {
  const titleId = useId();
  const urlId = useId();
  const fileId = useId();
  const descId = useId();

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
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to add resource"));
      setUploadProgress(0);
    },
  });

  const onSubmit = (data: UploadFormValues) => {
    createMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md p-0 overflow-hidden rounded-[20px] bg-[#131316] border border-white/10 shadow-2xl outline-none"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#4A00FF]/20 text-[#4A00FF]">
                <FileUp className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold text-foreground">Add Resource</DialogTitle>
            </div>
            <button 
              onClick={onClose}
              disabled={createMutation.isPending}
              className="rounded-full p-2 hover:bg-white/5 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-foreground block">Resource Type</span>
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
                    className={`flex flex-col items-center justify-center py-3 rounded-[12px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50 ${
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
              <label htmlFor={titleId} className="text-sm font-medium text-foreground">Title</label>
              <input
                id={titleId}
                {...register("title")}
                disabled={createMutation.isPending}
                className="w-full h-11 px-4 rounded-[12px] bg-[#1A1A1D] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50"
                placeholder="e.g. Physics Chapter 4"
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
            </div>

            {resourceType === "url" && (
              <div className="space-y-1.5">
                <label htmlFor={urlId} className="text-sm font-medium text-foreground">URL</label>
                <input
                  id={urlId}
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
                <label htmlFor={fileId} className="text-sm font-medium text-foreground">File Upload</label>
                <input
                  id={fileId}
                  type="file"
                  {...register("file")}
                  disabled={createMutation.isPending}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-sm file:font-semibold file:bg-[#4A00FF]/20 file:text-[#4A00FF] hover:file:bg-[#4A00FF]/30 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
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
              <label htmlFor={descId} className="text-sm font-medium text-foreground">
                {resourceType === "note" ? "Content" : "Description (Optional)"}
              </label>
              <textarea
                id={descId}
                {...register("description")}
                disabled={createMutation.isPending}
                className="w-full min-h-[100px] p-4 rounded-[12px] bg-[#1A1A1D] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors resize-none disabled:opacity-50"
                placeholder={resourceType === "note" ? "Write your note here..." : "Add a short description..."}
              />
              {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
            </div>

            {createMutation.isPending && isFileType && uploadProgress > 0 && (
              <div className="space-y-2 mt-4" role="status" aria-live="polite">
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
                className="px-4 py-2 rounded-[10px] bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 rounded-[10px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50"
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
      </DialogContent>
    </Dialog>
  );
}
