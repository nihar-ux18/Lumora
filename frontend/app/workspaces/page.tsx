"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { WorkspacePreviewCard } from "@/components/dashboard/workspace-preview-card";
import { WorkspacesSkeleton } from "@/components/dashboard/workspaces-skeleton";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { getDeterministicColor, formatDate } from "@/lib/utils";
import { FolderPlus, AlertCircle, Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WorkspacesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    data: workspaces = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceService.listWorkspaces,
  });

  const sortedWorkspaces = [...workspaces].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const filteredWorkspaces = sortedWorkspaces.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Workspaces
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your knowledge bases and learning environments
            </p>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-[12px] bg-[#4A00FF] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            New Workspace
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-[12px] bg-[#131316]/80 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors backdrop-blur-md"
          />
        </div>

        {isLoading ? (
          <WorkspacesSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-[16px] bg-[#131316]/40 border border-white/5">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Failed to load workspaces</h2>
            <button 
              onClick={() => refetch()}
              className="rounded-lg bg-[#4A00FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5A14FF]"
            >
              Try Again
            </button>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-[16px] bg-[#131316]/40 border border-white/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4A00FF]/10 mb-4">
              <FolderPlus className="h-8 w-8 text-[#4A00FF]" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">No workspaces yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-[300px]">
              Create a workspace to start organizing your knowledge and AI chats.
            </p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-[10px] bg-white/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/15 transition-colors"
            >
              Create Workspace
            </button>
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-muted-foreground">No workspaces found matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredWorkspaces.map((workspace, index) => (
              <Link href={`/workspaces/${workspace.id}`} key={workspace.id} className="block outline-none h-full">
                <WorkspacePreviewCard
                  id={workspace.id}
                  title={workspace.name}
                  description={workspace.description || "No description provided."}
                  lastUpdated={formatDate(workspace.updated_at)}
                  color={getDeterministicColor(workspace.id)}
                  delay={0.05 * Math.min(index, 10)}
                />
              </Link>
            ))}
          </motion.div>
        )}
      </div>

      <CreateWorkspaceDialog 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </AppShell>
  );
}
