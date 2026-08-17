"use client";

import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";

import { VoiceInfo } from "@/lib/type";
import ExpandedPlayer from "./ExpandedPlayer";

interface BottomSheetProps {
  audioUrl?: string | null;
  fileName?: string;
  voice?: VoiceInfo;
  generatedAt?: string;
  isGenerating?: boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
  isAudioLoading: boolean;
  setIsAudioLoading: Dispatch<SetStateAction<boolean>>;
  togglePlay: () => Promise<void>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  audioUrl,
  fileName = "generated-speech.mp3",
  voice = {
    name: "Zephyr",
    language: "English (US)",
    gender: "Neutral",
    style: "Natural",
    provider: "Gemini",
  },
  generatedAt = "Generated just now",
  isGenerating = false,
  audioRef,
  isAudioLoading,
  setIsAudioLoading,
  togglePlay,
  isPlaying,
  setIsPlaying,
}) => {
  const [expanded, setExpanded] = useState(true);

  const [downloadComplete, setDownloadComplete] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const hasAudio = Boolean(audioUrl);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handlePlay = (): void => {
      setIsPlaying(true);
      setIsAudioLoading(false);
    };

    const handlePause = (): void => {
      setIsPlaying(false);
    };

    const handleEnded = (): void => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleTimeUpdate = (): void => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = (): void => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setIsAudioLoading(false);
    };

    const handleDurationChange = (): void => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const handleWaiting = (): void => {
      setIsAudioLoading(true);
    };

    const handleCanPlay = (): void => {
      setIsAudioLoading(false);
    };

    const handleProgress = (): void => {
      if (!audio.duration || audio.buffered.length === 0) {
        setBuffered(0);
        return;
      }

      const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);

      const bufferedPercentage = (bufferedEnd / audio.duration) * 100;

      setBuffered(Math.min(bufferedPercentage, 100));
    };

    const handleError = (): void => {
      setIsPlaying(false);
      setIsAudioLoading(false);
      setDuration(0);
      setCurrentTime(0);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("progress", handleProgress);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("progress", handleProgress);
      audio.removeEventListener("error", handleError);
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.load();

    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    setIsPlaying(false);
    setDownloadComplete(false);

    if (audioUrl) {
      setExpanded(true);
    }
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.load();

    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    setIsPlaying(false);
    setDownloadComplete(false);

    if (audioUrl) {
      setExpanded(true);

      // Safely trigger play once the source changes
      const playAudioWhenReady = async () => {
        try {
          setIsAudioLoading(true);
          await audio.play();
        } catch (error) {
          setIsAudioLoading(false);
          console.error("Auto-play failed:", error);
        }
      };

      playAudioWhenReady();
    }
  }, [audioUrl, audioRef, setIsAudioLoading, setIsPlaying]);

  if (!hasAudio && !isGenerating) {
    return (
      //   <div className="w-full border-t bg-background">
      //     <div className="mx-auto flex min-h-20 w-full items-center justify-center px-4">
      //       <div className="flex items-center gap-2 text-sm text-muted-foreground">
      //         <Waves className="size-4" />
      //         Generated speech will appear here
      //       </div>
      //     </div>
      //   </div>

      null
    );
  }

  return (
    <div className="fixed border-t bottom-0 bg-background w-full 2xl:w-[calc(100%-var(--sidebar-width,0rem))]">
      <audio ref={audioRef} src={audioUrl ?? undefined} preload="metadata" />

      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26,
            }}
            className="absolute w-full bottom-1 0"
          >
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="group mx-auto mb-3 flex w-full flex-col items-center"
              aria-label="Collapse audio player"
            >
              <span className="h-1 w-20 rounded-full bg-muted-foreground/20 transition-all group-hover:w-16 group-hover:bg-muted-foreground/40" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <ExpandedPlayer
            isGenerating={isGenerating}
            isPlaying={isPlaying}
            generatedAt={generatedAt}
            setExpanded={setExpanded}
            voice={voice}
            duration={duration}
            setCurrentTime={setCurrentTime}
            audioRef={audioRef}
            hasAudio={hasAudio}
            downloadComplete={downloadComplete}
            setDownloadComplete={setDownloadComplete}
            audioUrl={audioUrl}
            fileName={fileName}
            currentTime={currentTime}
            buffered={buffered}
            isAudioLoading={isAudioLoading}
            togglePlay={togglePlay}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BottomSheet;
