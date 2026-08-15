import { VoiceGeneration } from "@/lib/type";

import { Badge } from "../ui/badge";
import VoiceCard from "./VoiceCard";
import { Dispatch, SetStateAction, useState } from "react";
import SearchAndFilter from "./SearchAndFilter";
import HistoryDetails from "./HistoryDetails";
import { AnimatePresence, motion } from "motion/react";

interface VoiceHistoryProps {
  initialHistory: VoiceGeneration[];
  setAudioUrl: Dispatch<SetStateAction<string | null>>;
  togglePlay: () => Promise<void>;
  isPlaying: boolean;
  audioUrl: string | null;
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setText: Dispatch<SetStateAction<string>>
}

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

const VoiceHistory = ({
  initialHistory,
  setAudioUrl,
  togglePlay,
  isPlaying,
  audioUrl,
  selectedId,
  setSelectedId,
  setText
}: VoiceHistoryProps) => {
  const groupedHistory = groupHistoryByDate(initialHistory);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VoiceGeneration | null>(
    null,
  );

  return (
    <div className="w-100 2xl:w-120 bg-sidebar border-l h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!openDetails && (
          <motion.div
            key="history-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            // Standard ease transition plays nicely with mode="wait"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col h-full pr-1"
          >
            {/* Top Header Tabs simulation */}
            <div className="px-6 pt-4 pb-3 border-b flex items-center gap-6 text-sm">
              <span className="text-muted-foreground font-medium cursor-pointer hover:text-foreground">
                Settings
              </span>
              <span className="font-semibold text-foreground border-b-2 border-foreground pb-3 -mb-[13px]">
                History
              </span>
            </div>

            <SearchAndFilter />

            {/* History Feed List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-accent scroll-fade">
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
                        <VoiceCard
                          isPlaying={isPlaying}
                          togglePlay={togglePlay}
                          setAudioUrl={setAudioUrl}
                          audioUrl={audioUrl}
                          key={item.id}
                          item={item}
                          selectedId={selectedId}
                          setSelectedId={setSelectedId}
                          setOpenDetails={setOpenDetails}
                          setSelectedItem={setSelectedItem}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {openDetails && selectedItem && (
          <motion.div
            key="history-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <HistoryDetails
              item={selectedItem}
              setOpenDetails={setOpenDetails}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              setText={setText}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceHistory;
