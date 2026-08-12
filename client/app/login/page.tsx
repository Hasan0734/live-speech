"use client";

import SocialAuthButtons from "@/components/social/SocialAuthButtons";
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500 selection:text-white font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/15 blur-[140px] pointer-events-none rounded-full" />

      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <Link href={'/'} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-linear-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-md shadow-red-600/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-white">
            OmniStudio<span className="text-red-500">.AI</span>
          </span>
        </Link>
      </header>

      <main className="max-w-md w-full mx-auto px-4 relative z-10 my-auto pb-16">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <div className="h-14 w-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
            <Sparkles className="h-7 w-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-red-500 via-rose-400 to-orange-400 bg-clip-text text-transparent">
              OmniStudio
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Sign in to access your dashboard, transcription pipelines, and AI
            image sync studios.
          </p>

          <SocialAuthButtons />

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure 256-bit Encrypted Server Authentication</span>
          </div>
        </div>

        {/* Legal Footer Text */}
        <p className="mt-8 text-center text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-zinc-300 transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-zinc-300 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </main>

      {/* Bottom Minimal Footer */}
      <footer className="w-full py-6 text-center text-xs text-zinc-600 relative z-10">
        © {new Date().getFullYear()} OmniStudio AI. All rights reserved.
      </footer>
    </div>
  );
}
