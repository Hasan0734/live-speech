import React from "react";
import { Zap, Globe, ShieldCheck } from "lucide-react";

export function WhyUs() {
  return (
    <section id="why-us" className="py-24 border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs font-semibold tracking-widest text-red-500 uppercase">The Competitive Edge</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">Why Choose OmniStudio AI?</p>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Built specifically for high-volume creators and production teams who are tired of switching between fragmented transcription software, script tools, and image generators.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Lightning Fast Server Infrastructure</h4>
                  <p className="text-xs text-zinc-400 mt-1">Optimized cloud pipeline processes hour-long audios and dozens of images in under 60 seconds.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">99+ Language Support</h4>
                  <p className="text-xs text-zinc-400 mt-1">Break language barriers with native multi-accent dialect training and automatic translation features.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Enterprise Privacy & Secure Dashboard</h4>
                  <p className="text-xs text-zinc-400 mt-1">Your data belongs to you. Fully encrypted server environment with strict zero-retention choices on enterprise keys.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 relative">
            <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Dashboard Preview
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <span className="text-sm font-medium text-white">Active Project Workflow</span>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Synced</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Processing Whisper Speech Chunk</span>
                  <span className="text-red-400 font-mono">100%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 w-full rounded-full" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Generating Batch Visual Prompts (12/12)</span>
                  <span className="text-emerald-400 font-mono">Ready</span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="h-10 rounded bg-zinc-800/80" />
                  <div className="h-10 rounded bg-zinc-800/80" />
                  <div className="h-10 rounded bg-zinc-800/80" />
                  <div className="h-10 rounded bg-red-600/40 border border-red-500/50" />
                </div>
              </div>
              <div className="pt-2 text-center">
                <span className="text-xs text-zinc-500 italic">Server latency: 42ms • Region: Global Edge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}