import { VoiceGeneration } from "@/lib/type";
import TooltipWrapper from "../TooltipWrapper";
import { Download, AlignLeft, Play, Pause } from "lucide-react";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

interface VoiceCardProps {
  item: VoiceGeneration;
  setAudioUrl: Dispatch<SetStateAction<string | null>>;
  togglePlay: () => Promise<void>;
  isPlaying: boolean;
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  audioUrl: string | null;
}

const VoiceCard = ({
  item,
  setAudioUrl,
  isPlaying,
  togglePlay,
  setSelectedId,
  selectedId,
  audioUrl,
}: VoiceCardProps) => {
  const isSelected = selectedId === item.id;
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const fileName = `${item.text_content.slice(0, 20)}.mp3`;

  const handleSelect = () => {
    if (isSelected) {
      togglePlay();
    } else {
      setSelectedId(item.id);
      setAudioUrl(item.public_url);
    }
  };

  const handleDownload = async (): Promise<void> => {
    try {
      setIsDownloading(true);
      setDownloadComplete(false);

      const response = await fetch(item.public_url);

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

      anchor.href = item.public_url;
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

  return (
    <div
      onClick={handleSelect}
      className={cn(
        "group flex justify-between items-center gap-1.5 p-4 rounded-xl bg-background hover:border-foreground/20 transition-all shadow-2xs cursor-pointer",
        {
          "bg-accent border-primary": isSelected,
        },
      )}
    >
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <span className="text-sm text-foreground font-medium leading-relaxed line-clamp-1 break-all">
          {item.text_content}
        </span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-4 h-4 rounded-full bg-linear-to-tr from-indigo-500 to-pink-500 shrink-0" />
          <span className="truncate max-w-42.5">{item.voice_used}</span>
          <span>·</span>
          <span className="shrink-0">
            {new Date(item.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-1 transition-opacity",
          isSelected
            ? "opacity-100 flex"
            : "hidden group-hover:flex opacity-0 group-hover:opacity-100",
        )}
      >
        <TooltipWrapper content={isSelected && isPlaying ? "Pause" : "Play"}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (!isSelected) {
                setSelectedId(item.id);
                setAudioUrl(item.public_url);
              } else {
                togglePlay();
              }
            }}
            variant="ghost"
            size={"icon-lg"}
          >
            {isSelected && isPlaying && audioUrl === item.public_url ? (
              <Pause />
            ) : (
              <Play />
            )}
          </Button>
        </TooltipWrapper>

        <TooltipWrapper content="Show details">
          <Button
            variant="ghost"
            size={"icon-lg"}
            onClick={(e) => e.stopPropagation()}
          >
            <AlignLeft />
          </Button>
        </TooltipWrapper>

        <TooltipWrapper content="Download">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            variant="ghost"
            size={"icon-lg"}
          >
            {isDownloading ? <Spinner /> : <Download />}
          </Button>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default VoiceCard;
