"use client";

import Link from "next/link";
import { ChevronRight, Folder } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";

interface WorkspaceBreadcrumbsProps {
  workspaceId?: string;
  workspaceName?: string;
  isLoading?: boolean;
}

export function WorkspaceBreadcrumbs({ workspaceId, workspaceName, isLoading }: WorkspaceBreadcrumbsProps) {
  const shouldFetch = !workspaceName && !!workspaceId;

  const { data: workspace, isLoading: isFetching } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => workspaceService.getWorkspace(workspaceId!),
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5,
  });

  const finalName = workspaceName || workspace?.name;
  const finalLoading = isLoading !== undefined ? isLoading : (shouldFetch && isFetching);

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link 
        href="/workspaces"
        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        <Folder className="h-4 w-4" />
        <span className="hidden sm:inline">Workspaces</span>
      </Link>
      
      {finalLoading ? (
        <>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
        </>
      ) : finalName ? (
        <>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[120px] sm:max-w-[200px]">
            {finalName}
          </span>
        </>
      ) : null}
    </nav>
  );
}
