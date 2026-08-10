import React from "react";
import { Mic, FileText, Sparkles, Image as ImageIcon } from "lucide-react";

export function Workflow() {
  return (
    <section id="workflow" className="py-24 border-t border-zinc-900 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-red-500 uppercase">Seamless Pipeline</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">How OmniStudio Works</p>
          <p className="mt-4 text-zinc-400">Go from raw audio recording to fully visualized scene timelines in four simple automated steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 relative">
            <div className="text-4xl font-black text-zinc-800 absolute top-4 right-6 select-none">01</div>
            <div className="h-10 w-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
              <Mic className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Upload Audio / Voice</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Drop your audio file or record straight into the server dashboard. Supports MP3, WAV, M4A up to gigabytes.</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 relative">
            <div className="text-4xl font-black text-zinc-800 absolute top-4 right-6 select-none">02</div>
            <div className="h-10 w-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Transcribe & Map</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Our advanced engine processes speech-to-text text blocks and anchors accurate word timestamps instantly.</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 relative">
            <div className="text-4xl font-black text-zinc-800 absolute top-4 right-6 select-none">03</div>
            <div className="h-10 w-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Extract Visual Prompts</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">AI analyzes transcript pauses and context segments, compiling tailored image descriptions for every section.</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 relative">
            <div className="text-4xl font-black text-zinc-800 absolute top-4 right-6 select-none">04</div>
            <div className="h-10 w-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h4 className="text-base font-semibold text-white mb-2">Generate & Export</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Batch generate high-definition visual graphics mapped to timeline markers, ready to deploy into your video editor.</p>
          </div>
        </div>
      </div>
    </section>
  );
}