"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService, WorkspaceUpdate } from "@/services/workspace.service";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { ErrorState } from "@/components/ui/error-state";
import { WorkspaceBreadcrumbs } from "@/components/workspaces/workspace-breadcrumbs";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: workspace,
    isLoading: isWorkspaceLoading,
    error: workspaceError,
    refetch: refetchWorkspace
  } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => workspaceService.getWorkspace(workspaceId),
    retry: 1,
  });

  useEffect(() => {
    if (workspace && !name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(workspace.name);
      setDescription(workspace.description || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  const updateMutation = useMutation({
    mutationFn: (data: WorkspaceUpdate) => workspaceService.updateWorkspace(workspaceId, data),
    onSuccess: (updatedWorkspace) => {
      queryClient.setQueryData(["workspace", workspaceId], updatedWorkspace);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace updated successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update workspace"));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }
    updateMutation.mutate({ name, description });
  };

  if (isWorkspaceLoading) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-7xl">
          <div className="h-4 w-48 bg-white/10 animate-pulse rounded mb-6" />
          <div className="h-10 w-full max-w-md bg-white/10 animate-pulse rounded mb-8" />
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#4A00FF]" />
            <p className="mt-4 text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (workspaceError || !workspace) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-7xl">
          <button
            onClick={() => router.push("/workspaces")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Workspaces
          </button>

          <ErrorState
            error={workspaceError}
            onRetry={refetchWorkspace}
            title="Workspace Load Failed"
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl">
        <WorkspaceBreadcrumbs workspaceName={workspace.name} isLoading={isWorkspaceLoading} />
        <WorkspaceNavigation workspaceId={workspace.id} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your workspace name and description.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Workspace Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Machine Learning 101"
                className="flex h-11 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4A00FF]/50 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this workspace about?"
                className="flex min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#4A00FF]/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 rounded-lg bg-[#4A00FF] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#5A14FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppShell>
  );
}
