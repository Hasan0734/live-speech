import React from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-red-500 uppercase">Loved by Creators</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">Trusted by Top Video Producers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                "OmniStudio cut my video production workflow in half. Being able to extract precise voice pause timestamps and automatically map them to image prompts is a massive game-changer."
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-zinc-800/80 pt-4">
              <div className="h-10 w-10 rounded-full bg-red-600/25 flex items-center justify-center font-bold text-red-400 text-sm">
                JD
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Jason Drake</h4>
                <p className="text-xs text-zinc-500">YouTube Creator (500k+ Subs)</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                "The audio transcription accuracy is unmatched, even with multi-speaker podcasts. The layout of the dashboard server tools makes handling bulk projects completely frictionless."
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-zinc-800/80 pt-4">
              <div className="h-10 w-10 rounded-full bg-red-600/25 flex items-center justify-center font-bold text-red-400 text-sm">
                AS
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Amanda Sterling</h4>
                <p className="text-xs text-zinc-500">Podcast Network Producer</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                "Prompt-to-image workflows used to require juggling 4 separate tools. OmniStudio unifies transcription, pauses, and visual generation seamlessly under one roof."
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-zinc-800/80 pt-4">
              <div className="h-10 w-10 rounded-full bg-red-600/25 flex items-center justify-center font-bold text-red-400 text-sm">
                MK
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Marcus Vance</h4>
                <p className="text-xs text-zinc-500">Agency Creative Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}