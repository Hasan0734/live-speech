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
  return (
    <div className="hidden md:block min-w-90  2xl:min-w-120 bg-sidebar border-l overflow-y-hidden h-full min-h-[calc(100vh-56px)] max-h-[calc(100vh-56px)]">
      <div className="px-6 pt-4 pb-3 border-b flex items-center gap-2 text-sm">
        <RotateCcwClock size={18} />
        <span className="font-semibold text-foreground ">History</span>
      </div>
      <div className="px-3 py-4  h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-accent scroll-fade mr-1">
        <Accordion type="multiple" className="space-y-4">
          {initialHistory.map((transcribe) => (
            <TranscribedCard transcribe={transcribe} key={transcribe.id} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default TranscribeSidebar;
