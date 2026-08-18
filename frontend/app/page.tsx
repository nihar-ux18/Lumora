import Link from "next/link";
import {
  Sparkles,
  Play,
  FileText,
  PlayCircle,
  Code,
  HelpCircle,
  Map
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#030303] text-[#F4F4F6] relative overflow-x-hidden font-sans py-4 sm:py-6 md:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-grid-pattern">
      {/* Glow layers in outer background */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-[#4A00FF]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[#8B5CF6]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* Main Container with thin purple border */}
      <div className="max-w-[1200px] mx-auto border border-[#4A00FF]/30 bg-[#0A0A0B]/95 rounded-2xl relative z-10 overflow-hidden shadow-[0_0_50px_rgba(74,0,255,0.15)] backdrop-blur-md">

        {/* Glow layers inside the bordered container */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#4A00FF]/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#4A00FF]/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {/* 1. NAVBAR */}
        <nav className="border-b border-white/10 bg-[#131316]/40 px-6 sm:px-8 py-4 flex items-center justify-between backdrop-blur-md relative z-20">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#8B5CF6] fill-[#8B5CF6]" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight text-white select-none">Lumora</span>
          </div>

          {/* Center: Links (Collapsed on mobile/tablet) */}
          <div className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main Navigation">
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50 rounded px-2 py-1">
              Features
            </a>
            <a href="#sources" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50 rounded px-2 py-1">
              Sources
            </a>
            <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50 rounded px-2 py-1">
              Pricing
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-zinc-300 hover:text-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/50 rounded px-2 py-1 hidden sm:inline"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="h-10 px-5 rounded-full bg-gradient-to-r from-[#4A00FF] to-[#8B5CF6] text-white text-sm font-semibold hover:opacity-90 hover:scale-[1.02] motion-safe:transition-all duration-200 shadow-md flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/80"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* 2. HERO */}
        <section className="px-6 sm:px-8 py-20 md:py-28 text-center max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Supercharge Your Mind.<br />
            Welcome to your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A00FF] to-[#8B5CF6]">
              Learning OS.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform scattered notes, long lectures, and complex documents into
            structured knowledge. Lumora uses AI to build a personalized
            learning system for your mastery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-[#4A00FF] to-[#8B5CF6] text-white font-semibold text-sm hover:opacity-90 hover:scale-[1.02] motion-safe:transition-all duration-200 shadow-[0_0_20px_rgba(74,0,255,0.3)] flex items-center justify-center w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/80"
            >
              Start Learning Free
            </Link>
            <button
              className="h-12 px-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors text-white font-semibold text-sm flex items-center justify-center gap-2 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <Play className="h-4 w-4 fill-white" aria-hidden="true" />
              Watch Demo
            </button>
          </div>
        </section>

        {/* 3. PRODUCT PREVIEW */}
        <section className="max-w-[1000px] mx-auto px-6 sm:px-8 mb-28 relative">
          {/* Radial Glow Behind Mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#4A00FF]/25 blur-[100px] rounded-full pointer-events-none z-0"></div>

          {/* Mockup Container */}
          <div className="relative z-10 bg-[#131316]/80 border border-white/15 rounded-xl overflow-hidden shadow-2xl shadow-black/80 aspect-[16/9] w-full">
            {/* Header of Mockup */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-[#1b1b22]/50">
              <div className="w-2.5 h-2.5 rounded-full bg-white/15"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/15"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/15"></div>
              <div className="ml-4 h-5 w-48 sm:w-64 bg-white/5 rounded border border-white/5"></div>
            </div>

            {/* Body of Mockup */}
            <div className="flex h-[calc(100%-3rem)] bg-[#0d0d0f]/30">
              {/* Mock Sidebar */}
              <div className="w-32 sm:w-44 border-r border-white/10 p-3 flex flex-col gap-2.5 shrink-0">
                <div className="h-7 w-full bg-[#4A00FF]/15 border border-[#4A00FF]/30 rounded"></div>
                <div className="h-7 w-3/4 bg-white/5 rounded"></div>
                <div className="h-7 w-5/6 bg-white/5 rounded"></div>
                <div className="h-7 w-2/3 bg-white/5 rounded"></div>
              </div>

              {/* Mock Main Area */}
              <div className="flex-grow p-4 sm:p-6 flex flex-col gap-4 overflow-hidden">
                <div className="h-7 w-1/3 bg-white/15 rounded"></div>
                <div className="flex gap-4">
                  <div className="flex-grow h-20 sm:h-28 bg-[#131316]/50 border border-white/10 rounded-lg relative overflow-hidden">
                    <div className="absolute top-2 left-2 h-2.5 w-1/2 bg-[#4A00FF]/40 rounded"></div>
                    <div className="absolute bottom-2 left-2 h-2.5 w-3/4 bg-white/5 rounded"></div>
                  </div>
                  <div className="flex-grow h-20 sm:h-28 bg-[#131316]/50 border border-white/10 rounded-lg relative overflow-hidden">
                    <div className="absolute top-2 left-2 h-2.5 w-2/3 bg-[#8B5CF6]/40 rounded"></div>
                    <div className="absolute bottom-2 left-2 h-2.5 w-1/2 bg-white/5 rounded"></div>
                  </div>
                </div>
                <div className="flex-grow bg-[#131316]/50 border border-white/10 rounded-lg mt-1 relative overflow-hidden p-3">
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-white/10 rounded"></div>
                    <div className="h-2.5 w-5/6 bg-white/10 rounded"></div>
                    <div className="h-2.5 w-4/6 bg-white/5 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. INGEST FROM ANYWHERE */}
        <section id="sources" className="max-w-5xl mx-auto px-6 sm:px-8 mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
              Ingest from Anywhere
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
              Connect your favorite platforms and let Lumora do the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PDF Card */}
            <div className="bg-[#131316]/40 border border-white/10 hover:border-white/20 p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:bg-[#131316]/75 group relative overflow-hidden">
              <div className="absolute inset-0 bg-[#FF5252]/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full"></div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-[#FF5252] shadow-lg shadow-black/20">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">PDFs & Documents</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Upload massive textbooks or research papers. We extract the core concepts instantly.
              </p>
            </div>

            {/* YouTube Card */}
            <div className="bg-[#131316]/40 border border-white/10 hover:border-white/20 p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:bg-[#131316]/75 group relative overflow-hidden">
              <div className="absolute inset-0 bg-[#FF0000]/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full"></div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-[#FF0000] shadow-lg shadow-black/20">
                <PlayCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">YouTube Links</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Paste a lecture URL. Get a full transcript, summary, and interactive quiz in seconds.
              </p>
            </div>

            {/* Code Card */}
            <div className="bg-[#131316]/40 border border-white/10 hover:border-white/20 p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:bg-[#131316]/75 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl rounded-full"></div>
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-white shadow-lg shadow-black/20">
                <Code className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Code & Web Pages</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Import documentation or repositories to generate technical study guides.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FEATURE GRID */}
        <section id="features" className="max-w-5xl mx-auto px-6 sm:px-8 mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Everything you need to master any subject.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[300px]">
            {/* Card A: Contextual AI Tutor (Col Span 8) */}
            <div className="md:col-span-8 bg-[#131316]/40 border border-white/10 hover:border-white/15 p-6 rounded-2xl relative overflow-hidden group transition-colors duration-300 hover:bg-[#131316]/60 flex flex-col justify-between min-h-[250px] md:min-h-0">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A00FF]/20 text-[#c8c0ff] text-xs font-semibold mb-4 border border-[#4A00FF]/30 select-none">
                  <Sparkles className="h-3 w-3 fill-[#c8c0ff]" aria-hidden="true" />
                  Core Feature
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Contextual AI Tutor</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
                  Ask questions against your uploaded materials. The AI strictly uses your context, eliminating hallucinations and ensuring accuracy.
                </p>
              </div>
              {/* Decorative element for large card */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-[#4A00FF]/15 to-transparent rounded-full blur-[45px] group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
            </div>

            {/* Card B: Auto-Quizzing (Col Span 4) */}
            <div className="md:col-span-4 bg-[#131316]/40 border border-white/10 hover:border-white/15 p-6 rounded-2xl flex flex-col justify-end relative overflow-hidden group transition-colors duration-300 hover:bg-[#131316]/60 min-h-[200px] md:min-h-0">
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] border border-[#8B5CF6]/20">
                <HelpCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Auto-Quizzing</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Test your retention with automatically generated spaced-repetition flashcards.
                </p>
              </div>
            </div>

            {/* Card C: Dynamic Roadmaps (Col Span 4) */}
            <div className="md:col-span-4 bg-[#131316]/40 border border-white/10 hover:border-white/15 p-6 rounded-2xl flex flex-col justify-end relative overflow-hidden group transition-colors duration-300 hover:bg-[#131316]/60 min-h-[200px] md:min-h-0">
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Map className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Dynamic Roadmaps</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  Visualize your learning path. Lumora breaks complex subjects into step-by-step milestones.
                </p>
              </div>
            </div>

            {/* Card D: TL;DR Summaries (Col Span 8) */}
            <div className="md:col-span-8 bg-[#131316]/40 border border-white/10 hover:border-white/15 p-6 rounded-2xl relative overflow-hidden group transition-colors duration-300 hover:bg-[#131316]/60 flex flex-col justify-between min-h-[250px] md:min-h-0">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">TL;DR Summaries</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
                  Instantly compress hours of lectures or hundreds of pages into digestible, bulleted summaries highlighting key terms and definitions.
                </p>
              </div>
              {/* Abstract visual representation of a summary */}
              <div className="mt-6 flex flex-col gap-2.5 opacity-40 max-w-sm">
                <div className="h-2.5 w-3/4 bg-white/10 rounded-full"></div>
                <div className="h-2.5 w-full bg-white/10 rounded-full"></div>
                <div className="h-2.5 w-5/6 bg-white/10 rounded-full"></div>
                <div className="h-2.5 w-1/2 bg-white/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="max-w-[900px] mx-auto px-6 sm:px-8 mb-32 relative">
          <div className="relative bg-[#131316]/60 border border-[#4A00FF]/30 rounded-2xl p-10 md:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[#4A00FF]/10 blur-3xl -z-10 pointer-events-none"></div>
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to upgrade your intellect?
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mb-8 leading-relaxed">
                Join thousands of students, researchers, and professionals who use Lumora to learn faster and retain more.
              </p>
              <Link
                href="/auth/register"
                className="h-12 px-10 rounded-full bg-gradient-to-r from-[#4A00FF] to-[#8B5CF6] text-white font-bold text-sm inline-flex items-center justify-center hover:scale-[1.03] transition-transform duration-200 shadow-[0_0_30px_rgba(74,0,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A00FF]/80"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>

        {/* 7. FOOTER */}
        <footer className="border-t border-white/5 bg-transparent py-8 relative z-10 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <div className="font-semibold tracking-wider text-zinc-400 uppercase select-none">
              Lumora
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6] rounded px-1">Privacy</a>
              <a href="#" className="hover:text-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6] rounded px-1">Terms</a>
              <a href="#" className="hover:text-[#8B5CF6] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6] rounded px-1">Support</a>
            </div>
            <div className="select-none">
              &copy; 2024 Lumora Learning OS. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
