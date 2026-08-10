import React from "react";
import { Check } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 border-t border-zinc-900 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold tracking-widest text-red-500 uppercase">Flexible Investment</h2>
          <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">Simple, Transparent Pricing</p>
          <p className="mt-4 text-zinc-400">Choose the plan that fits your creation volume. Switch or cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Free</h3>
              <p className="text-xs text-zinc-400 mt-1">For casual testing and hobbyists.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-white">$0</span>
                <span className="ml-1 text-xs text-zinc-400">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> 30 mins audio transcription</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Basic timestamp generator</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> 20 image generations /mo</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Community support</li>
              </ul>
            </div>
            <a href="/dashboard" className="mt-8 w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-center text-xs font-semibold text-white transition-colors">
              Get Started
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Creator Pro</h3>
              <p className="text-xs text-zinc-400 mt-1">For individual content creators.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-white">$19</span>
                <span className="ml-1 text-xs text-zinc-400">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> 10 hours audio transcription</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Advanced pause mapping</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> 300 image generations /mo</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Priority server processing</li>
              </ul>
            </div>
            <a href="/dashboard" className="mt-8 w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-center text-xs font-semibold text-white transition-colors">
              Choose Pro
            </a>
          </div>

          <div className="rounded-2xl border-2 border-red-500 bg-gradient-to-b from-red-500/10 via-zinc-900/40 to-zinc-900/40 p-6 flex flex-col justify-between relative shadow-xl shadow-red-600/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Growth</h3>
              <p className="text-xs text-zinc-400 mt-1">For growing video agencies & channels.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-white">$49</span>
                <span className="ml-1 text-xs text-zinc-400">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> 40 hours audio transcription</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Frame-accurate scene sync</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> 1,500 image generations /mo</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Team workspaces (up to 3)</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Custom branding & exports</li>
              </ul>
            </div>
            <a href="/dashboard" className="mt-8 w-full rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-center text-xs font-semibold text-white shadow-md shadow-red-600/30 transition-all">
              Get Growth Plan
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Unlimited</h3>
              <p className="text-xs text-zinc-400 mt-1">For heavy studios & enterprise teams.</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-white">$99</span>
                <span className="ml-1 text-xs text-zinc-400">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Unlimited audio transcription</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Unlimited prompt image gen</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> Dedicated server queue</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-500" /> 24/7 Priority support & API</li>
              </ul>
            </div>
            <a href="/dashboard" className="mt-8 w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-center text-xs font-semibold text-white transition-colors">
              Go Unlimited
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}