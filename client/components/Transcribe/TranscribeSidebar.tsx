import React from "react";
import { motion } from "motion/react";
import { RotateCcwClock } from "lucide-react";
import TranscribedCard from "./TranscribedCard";
import { Accordion } from "../ui/accordion";
import { Transcribe } from "@/lib/type";

interface TranscribeSidebarProps {
  initialHistory: Transcribe[];
}

const TranscribeSidebar = ({ initialHistory }: TranscribeSidebarProps) => {
  console.log(initialHistory);
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="w-100 2xl:w-120 bg-sidebar border-l h-screen overflow-hidden"
    >
      <div className="px-6 pt-4 pb-3 border-b flex items-center gap-2 text-sm">
        <RotateCcwClock size={18} />
        <span className="font-semibold text-foreground ">History</span>
      </div>
      <div className="px-3 py-4">
        <Accordion type="multiple" className="space-y-2">
          {initialHistory.map((transcribe) => (
            <TranscribedCard transcribe={transcribe} key={transcribe.id} />
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
};

export default TranscribeSidebar;
