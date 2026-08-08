"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revisionService, RevisionResponse } from "@/services/revision.service";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Sparkles, Loader2, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

export default function RevisionPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const queryClient = useQueryClient();

  const [topic, setTopic] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const cachedRevision = queryClient.getQueryData<RevisionResponse>(["revision", workspaceId]);

  const generateMutation = useMutation({
    mutationFn: (topicStr: string) => revisionService.generateRevision(workspaceId, { topic: topicStr }),
    onSuccess: (data) => {
      queryClient.setQueryData(["revision", workspaceId], data);
      setCurrentIndex(0);
      toast.success("Revision cards generated successfully");
    },
    onError: (error) => {
      let msg = "Failed to generate revision cards";
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

  const points = cachedRevision?.revision_points || [];

  const handleNext = () => {
    if (currentIndex < points.length - 1) setCurrentIndex(c => c + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl min-h-[calc(100vh-8rem)]">
        <Link 
          href={`/workspaces/${workspaceId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Workspace
        </Link>
        
        <div className="flex flex-col gap-6">
          <div className="rounded-[20px] bg-[#131316]/60 border border-white/10 p-6 backdrop-blur-[20px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#4A00FF]/20 text-[#4A00FF]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Revision Cards</h1>
                <p className="text-sm text-muted-foreground">Generate bite-sized revision points to quickly review topics.</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="flex items-center gap-4 mt-6">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What topic would you like to review?"
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

          <div className="flex-1 rounded-[20px] bg-[#131316]/60 border border-white/10 p-8 backdrop-blur-[20px] min-h-[400px] flex flex-col items-center justify-center">
            {generateMutation.isPending ? (
              <div className="w-full max-w-2xl h-64 rounded-[20px] bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <Loader2 className="h-8 w-8 animate-spin text-[#4A00FF] mb-4" />
                <p className="text-sm text-muted-foreground">Generating revision points...</p>
              </div>
            ) : points.length > 0 ? (
              <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full min-h-[250px] rounded-[24px] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 shadow-2xl flex items-center justify-center text-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4A00FF] to-purple-500 opacity-50" />
                    <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
                      {points[currentIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-6 w-full justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-foreground hover:bg-white/10 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <div className="flex gap-2">
                    {points.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentIndex ? "w-6 bg-[#4A00FF]" : "w-2 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentIndex === points.length - 1}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-foreground hover:bg-white/10 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-[#4A00FF]/10 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#4A00FF]/20">
                  <Lightbulb className="h-8 w-8 text-[#4A00FF]" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ready to Review</h3>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Enter a topic to generate flashcard-style revision points for quick and effective learning.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
