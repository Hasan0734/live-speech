import React from "react";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-20 relative overflow-hidden border-t border-zinc-900 bg-zinc-950">
      <div className="absolute inset-0  pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="rounded-3xl border border-red-500/30 bg-gradient-to-b from-zinc-900/80 to-zinc-950 p-10 sm:p-16 shadow-2xl relative">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Transform Your <span className="text-red-500">Audio Workflow?</span>
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-base">
            Join thousands of creators producing rhythm-perfect videos and precise transcriptions in seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="/dashboard" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-red-600/25 hover:bg-red-500 transition-all hover:scale-[1.02]"
            >
              Get Started Free <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}