"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { WorkspacePreviewCard } from "@/components/dashboard/workspace-preview-card";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { getDeterministicColor, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ErrorState } from "@/components/ui/error-state";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: workspaces = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceService.listWorkspaces,
  });

  const workspacesList = Array.isArray(workspaces) ? workspaces : [];

  // Remove duplicate workspaces by ID before rendering.
  const uniqueWorkspaces = Array.from(
    new Map(workspacesList.map((workspace) => [workspace.id, workspace])).values()
  );

  const sortedWorkspaces = [...uniqueWorkspaces].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  const recentWorkspaces = sortedWorkspaces.slice(0, 4);
  const isEmpty = uniqueWorkspaces.length === 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <DashboardHeader />

        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : isEmpty ? (
          <EmptyDashboard
            onCreateWorkspace={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <StatsGrid totalWorkspaces={uniqueWorkspaces.length} />

            <QuickActions
              onCreateWorkspace={() => setIsCreateModalOpen(true)}
            />

            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide text-foreground">
                  Recent Workspaces
                </h2>

                <Link
                  href="/workspaces"
                  className="text-xs font-medium text-[#4A00FF] transition-colors hover:text-[#5A14FF]"
                >
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentWorkspaces.map((workspace, index) => (
                  <Link
                    href={`/workspaces/${workspace.id}`}
                    key={workspace.id}
                    className="block outline-none"
                  >
                    <WorkspacePreviewCard
                      id={workspace.id}
                      title={workspace.name}
                      description={
                        workspace.description || "No description provided."
                      }
                      lastUpdated={formatDate(workspace.updated_at)}
                      color={getDeterministicColor(workspace.id)}
                      delay={0.1 + index * 0.1}
                    />
                  </Link>
                ))}
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