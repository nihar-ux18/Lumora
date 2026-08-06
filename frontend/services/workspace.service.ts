import { apiClient } from "@/lib/api-client";
import { WORKSPACES } from "@/constants";

export interface WorkspaceCreate {
  title: string;
  description?: string;
}

export interface WorkspaceUpdate {
  title?: string;
  description?: string;
}

export interface InviteMemberRequest {
  email: string;
}

export interface AcceptInvitationRequest {
  token: string;
}

export interface WorkspaceMemberRoleUpdate {
  role: string;
}

export const workspaceService = {
  createWorkspace: async (data: WorkspaceCreate) => {
    const response = await apiClient.post(WORKSPACES.CREATE, data);
    return response.data;
  },

  listWorkspaces: async () => {
    const response = await apiClient.get(WORKSPACES.LIST);
    return response.data;
  },

  getWorkspace: async (workspaceId: string) => {
    const response = await apiClient.get(WORKSPACES.DETAILS(workspaceId));
    return response.data;
  },

  updateWorkspace: async (workspaceId: string, data: WorkspaceUpdate) => {
    const response = await apiClient.patch(WORKSPACES.UPDATE(workspaceId), data);
    return response.data;
  },

  deleteWorkspace: async (workspaceId: string) => {
    const response = await apiClient.delete(WORKSPACES.DELETE(workspaceId));
    return response.data;
  },

  inviteMember: async (workspaceId: string, data: InviteMemberRequest) => {
    const response = await apiClient.post(WORKSPACES.INVITE(workspaceId), data);
    return response.data;
  },

  acceptInvitation: async (data: AcceptInvitationRequest) => {
    const response = await apiClient.post(WORKSPACES.ACCEPT_INVITATION, data);
    return response.data;
  },

  listMembers: async (workspaceId: string) => {
    const response = await apiClient.get(WORKSPACES.MEMBERS(workspaceId));
    return response.data;
  },

  updateMemberRole: async (workspaceId: string, userId: string, data: WorkspaceMemberRoleUpdate) => {
    const response = await apiClient.patch(WORKSPACES.UPDATE_MEMBER(workspaceId, userId), data);
    return response.data;
  },

  removeMember: async (workspaceId: string, userId: string) => {
    const response = await apiClient.delete(WORKSPACES.REMOVE_MEMBER(workspaceId, userId));
    return response.data;
  },
};
