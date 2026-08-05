export type MessageRole = "system" | "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: {
    documentId: string;
    title: string;
    snippet: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  workspaceId: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tag?: string;
}

export interface Summary {
  id: string;
  documentId: string;
  keyPoints: string[];
  abstract: string;
}
