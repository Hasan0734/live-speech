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