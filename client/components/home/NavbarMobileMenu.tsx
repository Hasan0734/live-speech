// components/NavbarMobileMenu.tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function NavbarMobileMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-zinc-400 hover:text-white"
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-3 shadow-xl">
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
    </>
  );
}