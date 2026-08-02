import React, { Dispatch, SetStateAction } from "react";
import { motion } from "motion/react";
import VoiceAvatar from "./VoiceAvatar";
import { Pause, Play } from "lucide-react";
import { Button } from "./ui/button";
import { formatTime } from "@/lib/utils";
import { VoiceInfo } from "@/lib/type";

interface CompactPlayerProps {
  isPlaying: boolean;
  isGenerating: boolean;
  voice: VoiceInfo;
  isAudioLoading: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
  togglePlay: () => Promise<void>;
  currentTime: number;
  duration: number;
  hasAudio: boolean
}

const CompactPlayer = ({
  isPlaying,
  isGenerating,
  voice,
  isAudioLoading,
  setExpanded,
  currentTime,
  duration,
  togglePlay,
  hasAudio
}: CompactPlayerProps) => {
  return (
    <motion.div
      key="compact-player"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="cursor-default"
    >
      <div
        onClick={() => setExpanded(true)}
        className="group flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/40"
      >
        <VoiceAvatar isPlaying={isPlaying} isGenerating={isGenerating} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">
              {isGenerating ? "Generating speech..." : voice.name}
            </p>

            {!isGenerating && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Ready
              </span>
            )}
          </div>

          <p className="truncate text-xs text-muted-foreground">
            {voice.language}
            {voice.style ? ` · ${voice.style}` : ""}
          </p>
        </div>

        {!isGenerating && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatTime(currentTime)}/ {formatTime(duration)}
          </span>
        )}

        <Button
          type="button"
          size="icon"
          disabled={!hasAudio || isGenerating}
          onClick={(event) => {
            event.stopPropagation();
            togglePlay();
          }}
          className="size-10 shrink-0 rounded-full"
        >
          {isGenerating || isAudioLoading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="size-4 fill-current" />
          ) : (
            <Play className="ml-0.5 size-4 fill-current" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default CompactPlayer;
