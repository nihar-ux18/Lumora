"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { summaryService } from "@/services/summary.service";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { WorkspaceBreadcrumbs } from "@/components/workspaces/workspace-breadcrumbs";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";

export default function SummaryPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const queryClient = useQueryClient();

  const [topic, setTopic] = useState("");

  const cachedSummary = queryClient.getQueryData<{ summary: string }>(["summary", workspaceId]);

  const generateMutation = useMutation({
    mutationFn: (topicStr: string) => summaryService.generateSummary(workspaceId, { topic: topicStr }),
    onSuccess: (data) => {
      queryClient.setQueryData(["summary", workspaceId], data);
      toast.success("Summary generated successfully");
    },
    onError: (error) => {
      let msg = "Failed to generate summary";
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
    generateMutation.mutate(topic);
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
                <h1 className="text-xl font-bold text-foreground">AI Summary</h1>
                <p className="text-sm text-muted-foreground">Generate comprehensive summaries from your workspace resources.</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="flex items-center gap-4 mt-6">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What topic would you like to summarize?"
                disabled={generateMutation.isPending}
                className="flex-1 h-12 px-4 rounded-[12px] bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#4A00FF]/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!topic.trim() || generateMutation.isPending}
                className="flex items-center gap-2 h-12 px-6 rounded-[12px] bg-[#4A00FF] text-sm font-medium text-white shadow-lg shadow-[#4A00FF]/25 hover:bg-[#5A14FF] transition-colors disabled:opacity-50"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generateMutation.isPending ? "Generating..." : "Generate"}
              </button>
            </form>
          </div>

          <div className="flex-1 rounded-[20px] bg-[#131316]/60 border border-white/10 p-8 backdrop-blur-[20px] min-h-[400px]">
            {generateMutation.isPending ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 w-1/3 bg-white/5 rounded-lg mb-8"></div>
                <div className="h-4 w-full bg-white/5 rounded"></div>
                <div className="h-4 w-full bg-white/5 rounded"></div>
                <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                <div className="h-4 w-4/6 bg-white/5 rounded"></div>
                <div className="h-4 w-full bg-white/5 rounded mt-6"></div>
                <div className="h-4 w-5/6 bg-white/5 rounded"></div>
              </div>
            ) : cachedSummary ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-[#4A00FF] max-w-none"
              >
                <ReactMarkdown>{cachedSummary.summary}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="h-16 w-16 bg-[#4A00FF]/10 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#4A00FF]/20">
                  <Sparkles className="h-8 w-8 text-[#4A00FF]" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ready to Summarize</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Enter a topic above and let AI analyze your workspace resources to create a detailed summary.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
