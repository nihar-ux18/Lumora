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

  inviteMember: async (workspaceId: string, data: InviteMemberRequest) => {
    const response = await apiClient.post(WORKSPACES.INVITE(workspaceId), data);
    return response.data;
  },

  acceptInvitation: async (data: AcceptInvitationRequest) => {
    const response = await apiClient.post(WORKSPACES.ACCEPT_INVITATION, data);
    return response.data;
  },
};
