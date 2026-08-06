"use client";

import { motion } from "framer-motion";
import { FileUp, HelpCircle, FolderPlus, FileText } from "lucide-react";
import { MOCK_ACTIVITIES } from "@/constants/mock-dashboard";

const iconMap: Record<string, React.ElementType> = {
  FileUp,
  HelpCircle,
  FolderPlus,
  FileText,
};

export function ActivityFeed() {
  return (
    <div className="rounded-[16px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px] h-full">
      <h2 className="text-sm font-semibold tracking-wide text-foreground mb-6">Recent Activity</h2>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {MOCK_ACTIVITIES.map((activity, index) => {
          const Icon = iconMap[activity.icon] || FileText;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Icon Marker */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#131316] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activity.bg}`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
              </div>
              
              {/* Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[12px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{activity.title}</span>
                  <span className="text-[10px] text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
