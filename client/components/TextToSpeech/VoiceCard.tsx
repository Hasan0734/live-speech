import { VoiceGeneration } from "@/lib/type";
import TooltipWrapper from "../TooltipWrapper";
import { Download, AlignLeft, Play } from "lucide-react";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";

interface VoiceCardProps {
  item: VoiceGeneration;
  setAudioUrl: Dispatch<SetStateAction<string | null>>;
}

const VoiceCard = ({ item, setAudioUrl }: VoiceCardProps) => {
  return (
    <div
      key={item.id}
      className="group flex justify-between items-center gap-1.5 p-4 rounded-xl  bg-background hover:border-foreground/20 transition-all shadow-2xs"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-foreground font-medium leading-relaxed line-clamp-1 break-all">
          {item.text_content}sa fadsf asdf asdfad
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
      <div className=" hidden group-hover:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipWrapper content="Play">
          <Button onClick={() => setAudioUrl(item.public_url)} variant="ghost" size={"icon-lg"}>
            <Play />
          </Button>
        </TooltipWrapper>
        <TooltipWrapper content="Show details">
          <Button variant="ghost" size={"icon-lg"}>
            <AlignLeft />
          </Button>
        </TooltipWrapper>

        <TooltipWrapper content="Download">
          <a href={item.public_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size={"icon-lg"}>
              <Download className="w-3.5 h-3.5" />
            </Button>
          </a>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default VoiceCard;
