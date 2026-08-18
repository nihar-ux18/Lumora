import { apiClient } from "@/lib/api-client";
import { USERS } from "@/constants";

export interface UserResponse {
  id: string;
  fullname: string;
  email: string;
  avatar_url: string | null;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  email_error?: string | null;
}

export interface UpdateProfileRequest {
  fullname?: string | null;
  avatar_url?: string | null;
}

export const usersService = {
  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get(USERS.ME);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    const response = await apiClient.patch(USERS.ME, data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(USERS.AVATAR, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
