"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does OmniStudio extract timestamps from audio?",
      a: "Our server engine utilizes state-of-the-art OpenAI Whisper architecture combined with custom acoustic pause-detection algorithms to map words and silence breaks down to the exact frame."
    },
    {
      q: "Can I use generated images for commercial video content?",
      a: "Yes! All images generated through your prompt pipeline on Creator Pro, Growth, and Unlimited tiers carry complete commercial exploitation rights."
    },
    {
      q: "What audio file formats are supported on the dashboard?",
      a: "We support MP3, WAV, M4A, AAC, FLAC, and OGG files up to 2GB per individual upload session."
    },
    {
      q: "Can I invite team members to collaborate on projects?",
      a: "Yes, our Growth and Unlimited plans feature team workspace configurations so editors and creators can share server assets instantly."
    }
  ];

  return (
    <section id="faq" className="py-24 border-t border-zinc-900 bg-zinc-950/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-red-500 uppercase">Got Questions?</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">Frequently Asked Questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-white font-medium hover:text-red-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform ${openFaq === idx ? 'rotate-180 text-red-500' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}