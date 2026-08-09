import { apiClient } from "@/lib/api-client";
import { WORKSPACES } from "@/constants";

export interface WorkspaceCreate {
  name: string;
  description?: string;
}

export interface WorkspaceUpdate {
  name?: string;
  description?: string;
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface InviteMemberRequest {
  email: string;
}

export interface AcceptInvitationRequest {
  token: string;
}

export type WorkspaceRole = "owner" | "admin" | "member";

export interface WorkspaceMemberResponse {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMemberRoleUpdate {
  role: WorkspaceRole;
}

export interface WorkspaceInvitationResponse {
  id: string;
  workspace_id: string;
  email: string;
  token: string;
  expires_at: string;
  accepted: boolean;
  created_at: string;
}

export const workspaceService = {
  createWorkspace: async (data: WorkspaceCreate): Promise<WorkspaceResponse> => {
    const response = await apiClient.post(WORKSPACES.CREATE, data);
    return response.data;
  },

  listWorkspaces: async (): Promise<WorkspaceResponse[]> => {
    const response = await apiClient.get(WORKSPACES.LIST);
    return response.data;
  },

  getWorkspace: async (workspaceId: string): Promise<WorkspaceResponse> => {
    const response = await apiClient.get(WORKSPACES.DETAILS(workspaceId));
    return response.data;
  },

  updateWorkspace: async (workspaceId: string, data: WorkspaceUpdate): Promise<WorkspaceResponse> => {
    const response = await apiClient.patch(WORKSPACES.UPDATE(workspaceId), data);
    return response.data;
  },

  deleteWorkspace: async (workspaceId: string): Promise<void> => {
    const response = await apiClient.delete(WORKSPACES.DELETE(workspaceId));
    return response.data;
  },

  listMembers: async (workspaceId: string): Promise<WorkspaceMemberResponse[]> => {
    const response = await apiClient.get(WORKSPACES.MEMBERS(workspaceId));
    return response.data;
  },

  changeMemberRole: async (workspaceId: string, userId: string, data: WorkspaceMemberRoleUpdate): Promise<WorkspaceMemberResponse> => {
    const response = await apiClient.patch(WORKSPACES.MEMBER_ROLE(workspaceId, userId), data);
    return response.data;
  },

  removeMember: async (workspaceId: string, userId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(WORKSPACES.REMOVE_MEMBER(workspaceId, userId));
    return response.data;
  },

  inviteMember: async (workspaceId: string, data: InviteMemberRequest): Promise<WorkspaceInvitationResponse> => {
    const response = await apiClient.post(WORKSPACES.INVITE(workspaceId), data);
    return response.data;
  },

  acceptInvitation: async (data: AcceptInvitationRequest): Promise<WorkspaceMemberResponse> => {
    const response = await apiClient.post(WORKSPACES.ACCEPT_INVITATION, data);
    return response.data;
  },
};
