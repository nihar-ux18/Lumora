"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { WorkspacePreviewCard } from "@/components/dashboard/workspace-preview-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";
import { MOCK_WORKSPACES } from "@/constants/mock-dashboard";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false); // Toggle to test empty state

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl">
        {isLoading ? (
          <DashboardSkeleton />
        ) : isEmpty ? (
          <EmptyDashboard />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardHeader />
            <StatsGrid />
            <QuickActions />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Left Column: Recent Workspaces */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold tracking-wide text-foreground">
                    Recent Workspaces
                  </h2>
                  <button className="text-xs font-medium text-[#4A00FF] hover:text-[#5A14FF] transition-colors">
                    View all
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_WORKSPACES.map((workspace, index) => (
                    <WorkspacePreviewCard
                      key={workspace.id}
                      id={workspace.id}
                      title={workspace.title}
                      description={workspace.description}
                      resourceCount={workspace.resourceCount}
                      lastUpdated={workspace.lastUpdated}
                      badges={workspace.badges}
                      color={workspace.color}
                      delay={0.2 + index * 0.1}
                    />
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
    </AppShell>
  );
}
