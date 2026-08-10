import React from "react";
import { FileText, Clock, Image as ImageIcon, Check } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-24 border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-red-500 uppercase">Core Capabilities</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">What You Can Do With OmniStudio</p>
          <p className="mt-4 text-zinc-400">Everything you need to scale video production, content repurposing, and automated AI media creation from a single unified server dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 hover:border-red-500/50 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">AI Audio Transcription</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Convert messy voice notes, long podcasts, or meetings into ultra-clean text across 99 languages using bleeding-edge speech recognition pipelines.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Automatic punctuation & spelling correction</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Multi-speaker diarization</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Instant export to SRT, VTT, and Docx</li>
            </ul>
          </div>

          <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 hover:border-red-500/50 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Timestamp Pause Mapping</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Analyze precise audio waveform pauses, speech cadences, and rhythm shifts to extract breakdown markers perfect for video cuts.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Frame-accurate word-level timestamps</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Pause-based scene rhythm segmentation</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Clean timeline payload configuration</li>
            </ul>
          </div>

          <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 hover:border-red-500/50 transition-all duration-300">
            <div className="h-12 w-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Prompt to Image Generation</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Transform script lines and custom prompts directly into striking, context-aware imagery synchronized precisely to your timestamps.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Automated prompt generation from text context</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Batch generation for fast timeline fill</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Cinematic styles, aspect ratios & lighting controls</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}