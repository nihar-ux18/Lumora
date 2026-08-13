"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { flashcardService, FlashcardResponse, Flashcard } from "@/services/flashcard.service";
import { useParams } from "next/navigation";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { WorkspaceBreadcrumbs } from "@/components/workspaces/workspace-breadcrumbs";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";

export default function FlashcardsPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const queryClient = useQueryClient();

  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState(5);

  const cachedFlashcards = queryClient.getQueryData<FlashcardResponse>(["flashcards", workspaceId]);

  const generateMutation = useMutation({
    mutationFn: (data: { topic: string; num_cards: number }) => 
      flashcardService.generateFlashcards(workspaceId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["flashcards", workspaceId], data);
      toast.success("Flashcards generated successfully");
    },
    onError: (error) => {
      let msg = "Failed to generate flashcards";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        msg = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map((e: { msg: string }) => e.msg).join(", ") 
          : error.response.data.detail;
      }
      toast.error(msg);
    },
    retry: false,
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || generateMutation.isPending) return;
    generateMutation.mutate({ topic, num_cards: numCards });
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl min-h-[calc(100vh-8rem)]">
        <WorkspaceBreadcrumbs workspaceId={workspaceId} />
        <WorkspaceNavigation workspaceId={workspaceId} />
        
        <div className="flex flex-col gap-6">
          <div className="rounded-[20px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#4A00FF]/20 text-[#4A00FF]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Flashcards</h1>
                <p className="text-sm text-muted-foreground">Generate flashcards from your workspace resources.</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What topic would you like to review?"
                disabled={generateMutation.isPending}
                className="flex-1 h-12 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50 w-full"
              />
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numCards}
                  onChange={(e) => setNumCards(Number(e.target.value))}
                  disabled={generateMutation.isPending}
                  className="w-24 h-12 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50 text-center shrink-0"
                />
                <button
                  type="submit"
                  disabled={!topic.trim() || generateMutation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 h-12 px-6 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                {generateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generateMutation.isPending ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>
          </div>

          <div className="flex-1 rounded-[20px] bg-[#131316]/60 border border-white/10 p-8 backdrop-blur-[20px] min-h-[400px]">
            {generateMutation.isPending ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-32 w-full bg-white/5 rounded-xl mb-4"></div>
                <div className="h-32 w-full bg-white/5 rounded-xl mb-4"></div>
                <div className="h-32 w-full bg-white/5 rounded-xl mb-4"></div>
              </div>
            ) : cachedFlashcards?.flashcards && cachedFlashcards.flashcards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cachedFlashcards.flashcards.map((card: Flashcard, i: number) => (
                  <div key={i} className="flex flex-col gap-2 rounded-xl bg-white/5 border border-white/10 p-5 relative overflow-hidden group">
                    <div className="text-xs font-medium text-[#4A00FF] mb-1">Question {i + 1}</div>
                    <div className="text-sm font-medium text-foreground">{card.question}</div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Answer</div>
                      <div className="text-sm text-foreground/80">{card.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="h-16 w-16 bg-[#4A00FF]/10 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#4A00FF]/20">
                  <Sparkles className="h-8 w-8 text-[#4A00FF]" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ready to Study</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Enter a topic and number of cards above, then let AI generate study flashcards from your workspace.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
