"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";

export default function Home() {
  const spring = {
    type: "spring",
    damping: 10,
    stiffness: 100,
  };

  return (
    <main className="h-screen flex justify-center items-center">
      <div className="flex flex-col min-w-60 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <Link href={"/text-to-speech"} className="w-full">
            <Button className="w-full" variant={"secondary"}>
              Text to speech
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full"
        >
          <Link href={"/live"} className="w-full">
            <Button className="w-full" variant={"secondary"}>
              Live chat with AI
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
