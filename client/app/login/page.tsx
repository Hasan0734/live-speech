"use client";

import React from "react";
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Add your NextAuth or Supabase Google OAuth handler here
    // e.g., signIn("google", { callbackUrl: "/dashboard" })
    console.log("Redirecting to Google OAuth...");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500 selection:text-white font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/15 blur-[140px] pointer-events-none rounded-full" />
      
      {/* Top Header with Back Link */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </a>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-md shadow-red-600/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-white">
            OmniStudio<span className="text-red-500">.AI</span>
          </span>
        </div>
      </header>

      {/* Main Login Card Center */}
      <main className="max-w-md w-full mx-auto px-4 relative z-10 my-auto pb-16">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
          
          {/* Subtle top inner border glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <div className="h-14 w-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
            <Sparkles className="h-7 w-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-red-500 via-rose-400 to-orange-400 bg-clip-text text-transparent">OmniStudio</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Sign in to access your dashboard, transcription pipelines, and AI image sync studios.
          </p>

          <div className="mt-8 space-y-4">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg hover:bg-zinc-100 transition-all active:scale-[0.98] group"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.18 21.3 7.22 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.09-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.18 2.7 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure 256-bit Encrypted Server Authentication</span>
          </div>

        </div>

        {/* Legal Footer Text */}
        <p className="mt-8 text-center text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-zinc-300 transition-colors">Terms</a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-zinc-300 transition-colors">Privacy Policy</a>
        </p>
      </main>

      {/* Bottom Minimal Footer */}
      <footer className="w-full py-6 text-center text-xs text-zinc-600 relative z-10">
        © {new Date().getFullYear()} OmniStudio AI. All rights reserved.
      </footer>

    </div>
  );
}