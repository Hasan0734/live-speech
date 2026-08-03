import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import VoiceAvatar from "../VoiceAvatar";
import { formatTime } from "@/lib/utils";
import { VoiceInfo } from "@/lib/type";
import { Button } from "../ui/button";
import {
  Check,
  ChevronDown,
  Download,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ExpandedPlayerProps {
  setExpanded: Dispatch<SetStateAction<boolean>>;
  isGenerating: boolean;
  isPlaying: boolean;
  voice: VoiceInfo;
  generatedAt: string;
  duration: number;
  hasAudio: boolean;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  fileName: string;
  downloadComplete: boolean;
  setDownloadComplete: Dispatch<SetStateAction<boolean>>;
  audioUrl: string | null | undefined;
  currentTime: number;
  buffered: number;
  togglePlay: () => Promise<void>;
  isAudioLoading: boolean;
}

const ExpandedPlayer = ({
  setExpanded,
  isGenerating,
  isPlaying,
  voice,
  generatedAt,
  duration,
  hasAudio,
  setCurrentTime,
  audioRef,
  fileName,
  downloadComplete,
  setDownloadComplete,
  audioUrl,
  currentTime,
  buffered,
  togglePlay,
  isAudioLoading,
}: ExpandedPlayerProps) => {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);

  const skipTime = (amount: number): void => {
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(audio.duration)) return;

    const nextTime = Math.min(
      Math.max(audio.currentTime + amount, 0),
      audio.duration,
    );

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSeekChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    if (!audio || Number.isNaN(nextTime)) return;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleProgressClick = (event: MouseEvent<HTMLDivElement>): void => {
    const audio = audioRef.current;
    const progressElement = progressRef.current;

    if (!audio || !progressElement || duration === 0) return;

    const bounds = progressElement.getBoundingClientRect();
    const position = event.clientX - bounds.left;
    const percentage = position / bounds.width;
    const nextTime = Math.min(Math.max(percentage * duration, 0), duration);

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const audio = audioRef.current;
    const nextVolume = Number(event.target.value);

    if (!audio || Number.isNaN(nextVolume)) return;

    audio.volume = nextVolume;
    setVolume(nextVolume);

    if (nextVolume > 0) {
      setPreviousVolume(nextVolume);
    }
  };

  const toggleMute = (): void => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.volume > 0) {
      setPreviousVolume(audio.volume);
      audio.volume = 0;
      setVolume(0);
      return;
    }

    const restoredVolume = previousVolume || 1;

    audio.volume = restoredVolume;
    setVolume(restoredVolume);
  };

  const handleDownload = async (): Promise<void> => {
    if (!audioUrl) return;

    try {
      setIsDownloading(true);
      setDownloadComplete(false);

      const response = await fetch(audioUrl);

      if (!response.ok) {
        throw new Error("Failed to download audio");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(blobUrl);

      setDownloadComplete(true);

      window.setTimeout(() => {
        setDownloadComplete(false);
      }, 2000);
    } catch (error) {
      console.error("Audio download failed:", error);

      const anchor = document.createElement("a");

      anchor.href = audioUrl;
      anchor.download = fileName;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } finally {
      setIsDownloading(false);
    }
  };

  const progressPercentage =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <motion.div
      key="expanded-player"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
      }}
      className="overflow-hidden cursor-default"
    >
      <div className="px-3 pb-4 pt-2 sm:px-5">
        <div className="flex items-center justify-between gap-10 ">
          <div className="flex items-start gap-3">
            <VoiceAvatar isPlaying={isPlaying} isGenerating={isGenerating} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-sm font-semibold sm:text-base">
                  {voice.name}
                </h2>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isGenerating
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {isGenerating ? "Processing" : "Generated"}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {voice.language}
                {voice.gender ? ` · ${voice.gender}` : ""}
                {voice.style ? ` · ${voice.style}` : ""}
              </p>

              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                {voice.provider && <span>{voice.provider}</span>}

                {!isGenerating && (
                  <>
                    <span>{generatedAt}</span>
                    {/* <span>{formatTime(duration)}</span> */}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="w-full">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="size-9 rounded-full"
                    aria-label={volume === 0 ? "Unmute audio" : "Mute audio"}
                  >
                    {volume === 0 ? (
                      <VolumeX className="size-4" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="size-4" />
                    ) : (
                      <Volume2 className="size-4" />
                    )}
                  </Button>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label="Audio volume"
                    className="hidden h-1 w-20 cursor-pointer accent-primary sm:block"
                  />
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={!hasAudio}
                    onClick={() => skipTime(-10)}
                    className="size-10 rounded-full"
                    aria-label="Rewind 10 seconds"
                  >
                    <div className="relative">
                      <RotateCcw className="size-5" />
                      <span className="absolute inset-0 flex items-center justify-center pt-0.5 text-[7px] font-bold">
                        10
                      </span>
                    </div>
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    disabled={!hasAudio}
                    onClick={() => togglePlay()}
                    className="size-10 rounded-full shadow-sm transition-transform hover:scale-105 active:scale-95"
                    aria-label={isPlaying ? "Pause speech" : "Play speech"}
                  >
                    {isAudioLoading ? (
                      <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : isPlaying ? (
                      <Pause className="size-5 fill-current" />
                    ) : (
                      <Play className="ml-0.5 size-5 fill-current" />
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={!hasAudio}
                    onClick={() => skipTime(10)}
                    className="size-10 rounded-full"
                    aria-label="Forward 10 seconds"
                  >
                    <div className="relative">
                      <RotateCw className="size-5" />
                      <span className="absolute inset-0 flex items-center justify-center pt-0.5 text-[7px] font-bold">
                        10
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
              <div className="mt-2 w-full">
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="group relative flex h-3 cursor-pointer items-center"
                >
                  <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-muted-foreground/15"
                      style={{
                        width: `${buffered}%`,
                      }}
                    />

                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>

                  <div
                    className="pointer-events-none absolute size-3.5 -translate-x-1/2 rounded-full border-2 border-background bg-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    style={{
                      left: `${progressPercentage}%`,
                    }}
                  />

                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.01}
                    value={currentTime}
                    onChange={handleSeekChange}
                    aria-label="Audio progress"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>

                <div className="flex justify-between text-[11px] tabular-nums text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasAudio || isGenerating || isDownloading}
              onClick={() => void handleDownload()}
              className="h-9 gap-2 rounded-full px-3 text-xs"
            >
              {isDownloading ? (
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : downloadComplete ? (
                <Check className="size-3.5" />
              ) : (
                <Download className="size-3.5" />
              )}

              <span className="hidden sm:inline">
                {downloadComplete ? "Downloaded" : "Download"}
              </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(false)}
              className="size-9 rounded-full"
              aria-label="Collapse player"
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpandedPlayer;

const GeneratingState: React.FC = () => {
  return (
    <div className="mt-5 rounded-xl border bg-muted/30 px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />

        <div className="flex-1">
          <p className="text-xs font-medium">Creating speech audio</p>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Processing text and synthesizing the selected voice
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "300%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-1/3 rounded-full bg-primary"
        />
      </div>
    </div>
  );
};
