"use client";

import { StatCard } from "./stat-card";

interface StatsGridProps {
  totalWorkspaces?: number;
}

export function StatsGrid({ totalWorkspaces = 0 }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Total Workspaces"
        value={totalWorkspaces.toString()}
        description="All your knowledge bases"
        trend="neutral"
        icon="Folder"
        delay={0}
      />
      {/* TODO: Add stats for Resources, AI Chats, and Quizzes once backend supports them */}
    </div>
  );
}
