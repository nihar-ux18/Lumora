"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useQuery, useMutation } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { resourceService } from "@/services/resource.service";
import { formatDate, getDeterministicColor } from "@/lib/utils";
import {
  Folder,
  Settings,
  Trash2,
  Plus,
  Search as SearchIcon,
  Loader2,
  ArrowLeft,
  Calendar
} from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { DeleteWorkspaceDialog } from "@/components/workspaces/delete-workspace-dialog";
import { UploadResourceDialog } from "@/components/resources/upload-resource-dialog";
import { ResourceCard } from "@/components/resources/resource-card";
import { DeleteResourceDialog } from "@/components/resources/delete-resource-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { WorkspaceMembersList } from "@/components/workspaces/workspace-members-list";
import { InviteMemberDialog } from "@/components/workspaces/invite-member-dialog";
import { WorkspaceBreadcrumbs } from "@/components/workspaces/workspace-breadcrumbs";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";
import { UserPlus } from "lucide-react";

export default function WorkspaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<{ id: string, title: string } | null>(null);

  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ chunk_index: number, content: string }[] | null>(null);

  const {
    data: workspace,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    error: workspaceError,
    refetch: refetchWorkspace
  } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => workspaceService.getWorkspace(workspaceId),
    enabled: !!workspaceId,
  });

  const {
    data: resources = [],
    isLoading: isResourcesLoading,
  } = useQuery({
    queryKey: ["resources", workspaceId],
    queryFn: () => resourceService.listResources(workspaceId),
    enabled: !!workspaceId,
  });

  const isOwner = !!(currentUser && workspace && currentUser.id === workspace.owner_id);

  const {
    data: members = [],
    isLoading: isMembersLoading,
  } = useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => workspaceService.listMembers(workspaceId),
    enabled: !!workspaceId && isOwner,
  });

  const resourcesList = Array.isArray(resources) ? resources : [];
  const membersList = Array.isArray(members) ? members : [];

  const searchMutation = useMutation({
    mutationFn: () => resourceService.searchResources(workspaceId, { query: searchQuery, limit: 5 }),
    onSuccess: (data) => setSearchResults(data),
    onError: () => toast.error("Failed to search resources"),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    searchMutation.mutate();
  };

  if (isWorkspaceLoading) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-7xl animate-pulse">
          <div className="h-6 w-24 bg-white/10 rounded mb-8"></div>
          <div className="h-12 w-1/3 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-white/10 rounded mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="h-64 bg-white/5 rounded-[16px] border border-white/10"></div>
              <div className="h-48 bg-white/5 rounded-[16px] border border-white/10"></div>
            </div>
            <div className="space-y-6">
              <div className="h-40 bg-white/5 rounded-[16px] border border-white/10"></div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (isWorkspaceError || !workspace) {
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

  const workspaceColor = getDeterministicColor(workspace.id);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl">
        <WorkspaceBreadcrumbs workspaceName={workspace.name} isLoading={isWorkspaceLoading} />
        <WorkspaceNavigation workspaceId={workspace.id} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className={`flex shrink-0 h-16 w-16 items-center justify-center rounded-[16px] ${workspaceColor} shadow-lg shadow-black/20`}>
              <Folder className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                {workspace.name}
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {workspace.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-start sm:justify-end">
            <Link href={`/workspaces/${workspaceId}/settings`} className="flex items-center gap-2 rounded-[10px] bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </Link>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2 rounded-[10px] bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-[16px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Folder className="h-4 w-4 text-[#4A00FF]" />
                  Resources
                </h3>

                <div className="flex items-center gap-3">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Ask AI or search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-[250px] h-9 pl-9 pr-4 rounded-[10px] bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <button type="submit" className="hidden" />
                  </form>
                  <button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#4A00FF] px-3 py-2 text-xs font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Upload
                  </button>
                </div>
              </div>

              {/* Search Results Area */}
              <AnimatePresence>
                {searchQuery && searchMutation.isPending && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 flex items-center justify-center py-8 border border-white/10 rounded-[12px] bg-white/5"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-[#4A00FF]" />
                  </motion.div>
                )}
                {searchResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-[#4A00FF]">Semantic Search Results</h4>
                      <button
                        onClick={() => { setSearchResults(null); setSearchQuery(""); }}
                        className="text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </button>
                    </div>
                    {searchResults.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground border border-white/5 rounded-[12px] bg-white/5">
                        No semantic chunks matched your query.
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {searchResults.map((result, idx) => (
                          <div key={idx} className="p-4 rounded-[12px] bg-white/5 border border-white/10 text-xs text-muted-foreground leading-relaxed">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-foreground mb-2">
                              Chunk {result.chunk_index}
                            </span>
                            <br />
                            {result.content}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resource Grid */}
              {isResourcesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-[16px] bg-white/5 border border-white/10 animate-pulse" />
                  ))}
                </div>
              ) : resourcesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/10 rounded-[12px]">
                  <p className="text-sm text-muted-foreground mb-4">No resources added yet.</p>
                  <button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="text-xs font-medium text-[#4A00FF] hover:text-[#5A14FF]"
                  >
                    + Upload Resource
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resourcesList.map((resource, index) => (
                    <ResourceCard
                      key={resource.id}
                      id={resource.id}
                      title={resource.title}
                      resource_type={resource.resource_type}
                      file_path={resource.file_path}
                      source_url={resource.source_url}
                      created_at={resource.created_at}
                      delay={index * 0.05}
                      onDelete={() => setResourceToDelete({ id: resource.id, title: resource.title })}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="rounded-[16px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px]">
              <h3 className="text-sm font-semibold text-foreground mb-4">Workspace Info</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Created</p>
                    <p className="text-sm text-foreground">{formatDate(workspace.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Last Updated</p>
                    <p className="text-sm text-foreground">{formatDate(workspace.updated_at)}</p>
                  </div>
                </div>

                {isOwner && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Members ({membersList.length})
                      </h4>
                      <button
                        onClick={() => setIsInviteDialogOpen(true)}
                        className="text-[10px] flex items-center gap-1 font-medium text-[#4A00FF] hover:text-[#5A14FF] transition-colors"
                      >
                        <UserPlus className="h-3 w-3" />
                        Invite
                      </button>
                    </div>

                    {isMembersLoading ? (
                      <div className="space-y-3 mt-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-14 rounded-[12px] bg-white/5 border border-white/10 animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <WorkspaceMembersList
                        workspaceId={workspaceId}
                        members={membersList}
                        currentUserId={currentUser?.id || ""}
                        isOwner={isOwner}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteWorkspaceDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        workspaceId={workspace.id}
        workspaceName={workspace.name}
      />

      <InviteMemberDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        workspaceId={workspace.id}
      />

      <UploadResourceDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        workspaceId={workspace.id}
      />

      <DeleteResourceDialog
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        workspaceId={workspace.id}
        resourceId={resourceToDelete?.id || ""}
        resourceTitle={resourceToDelete?.title || ""}
      />
    </AppShell>
  );
}

