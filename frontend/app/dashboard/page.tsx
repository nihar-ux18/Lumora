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
import { AlertCircle } from "lucide-react";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: workspaces = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceService.listWorkspaces,
  });

  // Remove duplicate workspaces by ID before rendering.
  const uniqueWorkspaces = Array.from(
    new Map(workspaces.map((workspace) => [workspace.id, workspace])).values()
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
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#131316]/40 p-8 text-center">
            <AlertCircle className="mb-3 h-8 w-8 text-red-400" />

            <h2 className="text-base font-semibold text-foreground">
              Failed to load workspaces
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Something went wrong while loading your workspaces.
            </p>

            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-[#4A00FF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5A14FF]"
            >
              Try Again
            </button>
          </div>
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
            <StatsGrid />

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