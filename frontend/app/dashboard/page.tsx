"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { WorkspacePreviewCard } from "@/components/dashboard/workspace-preview-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { getDeterministicColor, formatDate } from "@/lib/utils";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const recentWorkspaces = sortedWorkspaces.slice(0, 4);
  const isEmpty = workspaces.length === 0;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl">
        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Failed to load workspaces</h2>
            <button 
              onClick={() => refetch()}
              className="rounded-lg bg-[#4A00FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5A14FF]"
            >
              Try Again
            </button>
          </div>
        ) : isEmpty ? (
          <EmptyDashboard onCreateWorkspace={() => setIsCreateModalOpen(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardHeader />
            <StatsGrid totalWorkspaces={workspaces.length} />
            <QuickActions onCreateWorkspace={() => setIsCreateModalOpen(true)} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Left Column: Recent Workspaces */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold tracking-wide text-foreground">
                    Recent Workspaces
                  </h2>
                  <Link 
                    href="/workspaces"
                    className="text-xs font-medium text-[#4A00FF] hover:text-[#5A14FF] transition-colors"
                  >
                    View all
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentWorkspaces.map((workspace, index) => (
                    <Link href={`/workspaces/${workspace.id}`} key={workspace.id} className="block outline-none">
                      <WorkspacePreviewCard
                        id={workspace.id}
                        title={workspace.name}
                        description={workspace.description || "No description provided."}
                        lastUpdated={formatDate(workspace.updated_at)}
                        color={getDeterministicColor(workspace.id)}
                        delay={0.1 + index * 0.1}
                      />
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Right Column: Activity Feed */}
              <div className="lg:col-span-1">
                <ActivityFeed />
              </div>
            </div>
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
