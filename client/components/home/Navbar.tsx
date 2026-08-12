import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { NavbarMobileMenu } from "./NavbarMobileMenu";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0];


  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={'/'} className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            OmniStudio<span className="text-red-500">.AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#workflow" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#why-us" className="hover:text-white transition-colors">
            Why OmniStudio
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a
            href="#testimonials"
            className="hover:text-white transition-colors"
          >
            Testimonials
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {user ? (
          <div className="flex items-center gap-3 text-sm text-zinc-200">
            <div>
              Welcome,{" "}
              <span className="font-semibold text-white">{displayName}</span>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all active:scale-95"
            >
              Dashboard <ArrowRight size={18}/>
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all active:scale-95"
            >
              Start Free
            </Link>
          </div>
        )}

        <NavbarMobileMenu />
      </div>
    </header>
  );
}
