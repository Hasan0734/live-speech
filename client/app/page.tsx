"use client";

import React, { useState } from "react";
import { 
  Mic, 
  FileText, 
  Clock, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowRight, 
  Check, 
  Menu, 
  X, 
  Play, 
  Zap, 
  Layers, 
  Globe, 
  ShieldCheck,
  ChevronDown,
  Star
} from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Workflow } from "@/components/home/Workflow";
import { WhyUs } from "@/components/home/WhyUs";
import { Pricing } from "@/components/home/Pricing";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Footer } from "@/components/home/Footer";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500 selection:text-white font-sans antialiased">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <WhyUs />
      <Pricing />
      <Testimonials />
      <Faq />
      <CtaBanner />
      <Footer />
    </div>
  );
}