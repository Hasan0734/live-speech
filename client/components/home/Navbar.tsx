"use client";

import React, { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const supbase =  createClient()


  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            OmniStudio<span className="text-red-500">.AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
          <a href="#why-us" className="hover:text-white transition-colors">Why OmniStudio</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2">
            Sign In
          </a>
          <a 
            href="/dashboard" 
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all active:scale-95"
          >
            Get Started Free
          </a>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-3">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300">Features</a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300">How It Works</a>
          <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300">Why OmniStudio</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300">Pricing</a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300">Testimonials</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300">FAQ</a>
          <div className="pt-4 flex flex-col gap-3">
            <a href="/login" className="text-center py-2 text-zinc-300 font-medium">Sign In</a>
            <a href="/dashboard" className="text-center rounded-lg bg-red-600 py-2.5 font-semibold text-white">Get Started Free</a>
          </div>
        </div>
      )}
    </header>
  );
}