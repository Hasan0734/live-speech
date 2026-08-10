import React from "react";
import {
  Mic,
  Clock,
  Image as ImageIcon,
  ArrowRight,
  Play,
  Check,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-28 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-red-400 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          V2.0 Engine Released: Voice Pauses to Visual Sync Studio
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Turn Audio Into{" "}
          <br/>
          <span className="bg-gradient-to-r from-red-500 via-rose-400 to-orange-400 bg-clip-text text-transparent">
            Accurate Text
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          The all-in-one AI engine built for creators. Transcribe multi-language
          voice data with frame-accurate timestamps, map speech pauses to
          automated scenes, and generate stunning contextual visuals instantly.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-red-600/25 hover:bg-red-500 transition-all hover:scale-[1.02] active:scale-95"
          >
            Turn Audio Into Accurate Text <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#workflow"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-8 py-4 text-base font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            <Play className="h-4 w-4 text-red-500 fill-red-500" /> Watch
            Workflow Demo
          </a>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          No credit card required • Free trial includes 30 minutes of
          transcription & AI generation
        </p>

        <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 shadow-2xl backdrop-blur-xl">
          <div className="rounded-xl bg-zinc-950 border border-zinc-800/60 overflow-hidden text-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-zinc-400 font-mono">
                  omnistudio-dashboard://server-session
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />{" "}
                Server Online
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800 p-6 gap-6">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="h-4 w-4 text-red-500" /> 1. Audio Input &
                  Whisper AI
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono">
                  podcast_episode_final_cut.wav (45 MB)
                </div>
                <div className="text-xs text-zinc-500">
                  99 languages detected with 99.4% word accuracy model.
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-red-500" /> 2. Pause &
                  Timestamp Map
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] flex justify-between">
                    <span className="text-red-400 font-mono">[00:12.40]</span>
                    <span className="text-zinc-300 truncate w-36">
                      "The architecture of modern AI..."
                    </span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] flex justify-between">
                    <span className="text-red-400 font-mono">[00:18.92]</span>
                    <span className="text-zinc-300 truncate w-36">
                      "Scale server throughput rapidly..."
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-red-500" /> 3. Prompt &
                  Image Generation
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                    Gen Visual 1
                  </div>
                  <div className="h-16 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                    Gen Visual 2
                  </div>
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Auto-synced with timeline
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
