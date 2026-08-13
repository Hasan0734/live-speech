import { VoiceGeneration } from "@/lib/type";

import {
  Search,
  SlidersHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import VoiceCard from "./VoiceCard";
import { Dispatch, SetStateAction } from "react";

interface VoiceHistoryProps {
  initialHistory: VoiceGeneration[];
  setAudioUrl:  Dispatch<SetStateAction<string | null>>
}

// Helper function to group history items by date strings (e.g., "August 2, 2026")
const groupHistoryByDate = (items: VoiceGeneration[]) => {
  const groups: { [dateStr: string]: VoiceGeneration[] } = {};

  items.forEach((item) => {
    const dateObj = new Date(item.created_at);
    const dateStr = dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(item);
  });

  return groups;
};

const VoiceHistory = ({ initialHistory, setAudioUrl }: VoiceHistoryProps) => {
  const groupedHistory = groupHistoryByDate(initialHistory);

  return (
    <div className="w-120 bg-sidebar border-l h-full flex flex-col">
      {/* Top Header Tabs simulation */}
      <div className="px-6 pt-4 pb-3 border-b flex items-center gap-6 text-sm">
        <span className="text-muted-foreground font-medium cursor-pointer hover:text-foreground">
          Settings
        </span>
        <span className="font-semibold text-foreground border-b-2 border-foreground pb-3 -mb-[13px]">
          History
        </span>
      </div>

      {/* Search and Filters Section */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              className="pl-9 bg-background/50 h-9 text-xs rounded-lg border-border"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent text-muted-foreground flex items-center gap-1 shrink-0">
            <span>+</span> Voice
          </button>
          <button className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent text-muted-foreground flex items-center gap-1 shrink-0">
            <span>+</span> Model
          </button>
          <button className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent text-muted-foreground flex items-center gap-1 shrink-0">
            <span>+</span> Date
          </button>
          <button className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent text-muted-foreground flex items-center gap-1 shrink-0">
            <span>+</span> Source
          </button>
        </div>
      </div>

      {/* History Feed List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-accent">
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <p className="text-sm">No history found</p>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([dateStr, items]) => (
            <div key={dateStr} className="space-y-3">
              <div className="flex justify-center">
                <Badge variant={"secondary"}>{dateStr}</Badge>
              </div>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <VoiceCard setAudioUrl={setAudioUrl} key={item.id} item={item}/>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoiceHistory;
