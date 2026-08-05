import { CheckIcon, MicVocalIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { formatDuration, formatTime } from "@/lib/utils";

interface AudioPreviewProps {
  audioFile: File;
  audioSrc: string;
  clearAudioState: () => void;
}

const AudioPreview = ({
  audioFile,
  audioSrc,
  clearAudioState,
}: AudioPreviewProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = (): void => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : null);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "spring",
        damping: 50,
        stiffness: 100,
      }}
      className="border-2 border-dashed rounded-2xl p-5 mb-6 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-secondary flex items-center justify-center p-3">
            <MicVocalIcon size={18} />
          </div>
          <div>
            <h3>{audioFile.name}</h3>
            <p>{duration && formatDuration(duration)}· ~5 credits needed</p>
          </div>
        </div>
        <div>
          <Button
            onClick={clearAudioState}
            className=""
            variant={"ghost"}
            size={"icon"}
          >
            <XIcon />
          </Button>
        </div>
      </div>
      <audio ref={audioRef} src={audioSrc} controls className="w-full p-1.5" />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between itesm-center text-sm">
          <p className="text-muted-foreground">Uploading audio...</p>
          <p>20%</p>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 bg-muted-foreground/15"
            style={{
              width: `${10}%`,
            }}
          />

          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{
              width: `${10}%`,
            }}
          />
        </div>
      </div>
      <div>
        <p className="text-xs text-green-500 flex items-center gap-1">
          <CheckIcon size={14} /> Uploaded — ready to transcribe
        </p>
      </div>
    </motion.div>
  );
};

export default AudioPreview;
