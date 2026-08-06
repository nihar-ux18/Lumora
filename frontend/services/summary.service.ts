import { apiClient } from "@/lib/api-client";
import { SUMMARY } from "@/constants";

export interface SummaryGenerateRequest {
  topic: string;
}

export const summaryService = {
  generateSummary: async (workspaceId: string, data: SummaryGenerateRequest) => {
    const response = await apiClient.post(SUMMARY.GENERATE(workspaceId), data);
    return response.data;
  },
};
