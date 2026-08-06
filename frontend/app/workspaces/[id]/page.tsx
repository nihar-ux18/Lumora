"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { formatDate, getDeterministicColor } from "@/lib/utils";
import { AlertCircle, Folder, Calendar, Users, Settings, Trash2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteWorkspaceDialog } from "@/components/workspaces/delete-workspace-dialog";

export default function WorkspaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { 
    data: workspace, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => workspaceService.getWorkspace(workspaceId),
    enabled: !!workspaceId,
  });

  if (isLoading) {
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

  if (isError || !workspace) {
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
          
          <div className="flex flex-col items-center justify-center py-20 rounded-[16px] bg-[#131316]/40 border border-white/5 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Workspace Not Found</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              The workspace you are looking for might have been deleted or you don't have access to it.
            </p>
            <button 
              onClick={() => refetch()}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/15"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const workspaceColor = getDeterministicColor(workspace.id);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl">
        <Link 
          href="/workspaces"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </Link>
        
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
          
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 rounded-[10px] bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </button>
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
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Folder className="h-4 w-4 text-[#4A00FF]" />
                Resources
              </h3>
              {/* TODO: Fetch and display resources here once backend is integrated */}
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

                {/* TODO: Fetch and display members here once backend is integrated */}
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
    </AppShell>
  );
}
