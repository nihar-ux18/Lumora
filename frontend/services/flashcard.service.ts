import { apiClient } from "@/lib/api-client";
import { FLASHCARDS } from "@/constants";

export interface FlashcardGenerateRequest {
  topic: string;
  num_cards: number;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardResponse {
  flashcards: Flashcard[];
}

export const flashcardService = {
  generateFlashcards: async (workspaceId: string, data: FlashcardGenerateRequest): Promise<FlashcardResponse> => {
    const response = await apiClient.post(FLASHCARDS.GENERATE(workspaceId), data);
    return response.data;
  },
};
