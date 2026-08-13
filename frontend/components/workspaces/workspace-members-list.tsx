"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, MoreVertical, Trash2, Shield, ShieldAlert, Loader2 } from "lucide-react";
import { WorkspaceMemberResponse, WorkspaceRole, workspaceService } from "@/services/workspace.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

interface WorkspaceMembersListProps {
  workspaceId: string;
  members: WorkspaceMemberResponse[];
  currentUserId: string;
  isOwner: boolean;
}

const roleIconMap: Record<WorkspaceRole, React.ElementType> = {
  owner: ShieldAlert,
  admin: Shield,
  member: User,
};

const roleColorMap: Record<WorkspaceRole, string> = {
  owner: "text-red-400 bg-red-400/10",
  admin: "text-[#4A00FF] bg-[#4A00FF]/10",
  member: "text-foreground bg-white/5",
};

export function WorkspaceMembersList({ workspaceId, members, currentUserId, isOwner }: WorkspaceMembersListProps) {
  const queryClient = useQueryClient();
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: WorkspaceRole }) => 
      workspaceService.changeMemberRole(workspaceId, userId, { role }),
    onMutate: (vars) => setLoadingMemberId(vars.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
      toast.success("Member role updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update member role"));
    },
    onSettled: () => setLoadingMemberId(null),
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => workspaceService.removeMember(workspaceId, userId),
    onMutate: (userId) => setLoadingMemberId(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
      toast.success("Member removed successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to remove member"));
    },
    onSettled: () => setLoadingMemberId(null),
  });

  const handleRoleChange = (userId: string, role: WorkspaceRole) => {
    roleMutation.mutate({ userId, role });
  };

  const handleRemove = (userId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      removeMutation.mutate(userId);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      {members.map((member, index) => {
        const Icon = roleIconMap[member.role];
        const isCurrentRowOwner = member.role === "owner";
        const isCurrentUser = member.user_id === currentUserId;
        const isPending = loadingMemberId === member.user_id;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            key={member.user_id}
            className="flex items-center justify-between p-3 rounded-[12px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                    {member.user_id}
                  </span>
                  {isCurrentUser && (
                    <span className="text-[10px] font-medium text-[#4A00FF] bg-[#4A00FF]/10 px-1.5 py-0.5 rounded uppercase shrink-0">
                      You
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  Joined {formatDate(member.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-medium px-2 py-1 rounded uppercase flex items-center gap-1 ${roleColorMap[member.role]}`}>
                <Icon className="h-3 w-3" />
                {member.role}
              </span>

              {isOwner && !isCurrentRowOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger disabled={isPending} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors outline-none disabled:opacity-50">
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-[#131316]/95 border-white/10 backdrop-blur-xl">
                    <DropdownMenuItem 
                      onClick={() => handleRoleChange(member.user_id, "admin")}
                      disabled={member.role === "admin"}
                      className="text-xs text-foreground focus:bg-white/10 focus:text-foreground cursor-pointer"
                    >
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRoleChange(member.user_id, "member")}
                      disabled={member.role === "member"}
                      className="text-xs text-foreground focus:bg-white/10 focus:text-foreground cursor-pointer"
                    >
                      Make Member
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => handleRemove(member.user_id)}
                      className="text-xs text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer flex items-center gap-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
