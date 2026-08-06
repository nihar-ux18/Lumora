"use client";

import { StatCard } from "./stat-card";
import { MOCK_STATS } from "@/constants/mock-dashboard";

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {MOCK_STATS.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          trend={stat.trend as "up" | "down" | "neutral"}
          icon={stat.icon}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
