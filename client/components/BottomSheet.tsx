"use client";

import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronDown,
  Download,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Sparkles,
  Volume1,
  Volume2,
  VolumeX,
  Waves,
} from "lucide-react";

import { Button } from "./ui/button";
import CompactPlayer from "./CompactPlayer";
import VoiceAvatar from "./VoiceAvatar";
import { VoiceInfo } from "@/lib/type";
import { formatTime } from "@/lib/utils";
import ExpandedPlayer from "./ExpandedPlayer";

interface BottomSheetProps {
  audioUrl?: string | null;
  fileName?: string;
  voice?: VoiceInfo;
  generatedAt?: string;
  isGenerating?: boolean;
}

const playbackRates = [0.75, 1, 1.25, 1.5, 2];

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
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speedMenuRef = useRef<HTMLDivElement | null>(null);

  const [expanded, setExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

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
    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      if (
        speedMenuRef.current &&
        !speedMenuRef.current.contains(event.target as Node)
      ) {
        setShowSpeedMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const togglePlay = async (): Promise<void> => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) return;

    try {
      if (audio.paused) {
        setIsAudioLoading(true);
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      setIsAudioLoading(false);
      console.error("Audio playback failed:", error);
    }
  };

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
    <div className="relative w-full">
      <audio ref={audioRef} src={audioUrl ?? undefined} preload="metadata" />

      <AnimatePresence mode="wait">
        {!expanded ? (
          <CompactPlayer
            currentTime={currentTime}
            duration={duration}
            togglePlay={togglePlay}
            voice={voice}
            isAudioLoading={isAudioLoading}
            isPlaying={isPlaying}
            isGenerating={isGenerating}
            setExpanded={setExpanded}
            hasAudio={hasAudio}
          />
        ) : (
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
            setShowSpeedMenu={setShowSpeedMenu}
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
