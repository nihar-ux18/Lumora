"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  RefreshCcw, 
  GraduationCap, 
  Map as MapIcon, 
  Layers, 
  Settings 
} from "lucide-react";

interface WorkspaceNavigationProps {
  workspaceId: string;
}

export function WorkspaceNavigation({ workspaceId }: WorkspaceNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", path: `/workspaces/${workspaceId}`, icon: LayoutDashboard },
    { name: "Chat", path: `/workspaces/${workspaceId}/chat`, icon: MessageSquare },
    { name: "Summary", path: `/workspaces/${workspaceId}/summary`, icon: FileText },
    { name: "Revision", path: `/workspaces/${workspaceId}/revision`, icon: RefreshCcw },
    { name: "Quiz", path: `/workspaces/${workspaceId}/quiz`, icon: GraduationCap },
    { name: "Roadmap", path: `/workspaces/${workspaceId}/roadmap`, icon: MapIcon },
    { name: "Flashcards", path: `/workspaces/${workspaceId}/flashcards`, icon: Layers },
    { name: "Settings", path: `/workspaces/${workspaceId}/settings`, icon: Settings },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6 border-b border-white/10 hide-scrollbar">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              isActive 
                ? "bg-[#4A00FF]/10 text-[#4A00FF] border border-[#4A00FF]/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
