import { Copy, Download, Sparkles } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
} from "../ui/input-group";
import { Button } from "../ui/button";
import { Transcribe } from "@/lib/type";
import { formatDuration } from "@/lib/utils";
import { format, formatDistance } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

interface TranscribedCardProps {
  transcribe: Transcribe;
}

const TranscribedCard = ({ transcribe }: TranscribedCardProps) => {
  const router = useRouter();

  const handleGenerate = () => {
    sessionStorage.setItem("promptScript", transcribe.text_content);
    router.push("/dashboard/prompt-generation");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcribe.text_content);
      toast.success("Text copied successfully!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copied text.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcribe.text_content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${transcribe.file_name}-transcribed.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AccordionItem value={transcribe.id} className="border-b-0!">
      <div className="bg-accent p-2 rounded-xl">
        <AccordionTrigger className="hover:no-underline py-0 items-center">
          <div>
            <p className="line-clamp-1 text-sm font-medium ">{transcribe.file_name}</p>
            <p className="text-[10px] text-muted-foreground mt-2">
              {formatDuration(transcribe.duration)} ·{" "}
              <span className="capitalize">{transcribe.mode} mode</span> · ~6
              creadits used ·{" "}
              {format(
                new Date(transcribe.created_at),
                "MMM dd, yyyy, hh:mm aa",
              )}
              , ·{" "}
              {formatDistance(transcribe.created_at, new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0! mt-2" asChild>
          <InputGroup className="bg-sidebar! px-0 dark:has-disabled:bg-input/30 pt-2 has-disabled:opacity-100 flex-1 has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:max-h-100 has-[[data-slot=input-group-control]:focus-visible]:scrollbar-thumb-accent">
            <InputGroupTextarea className="text-muted-foreground text-xs!" value={transcribe.text_content} readOnly />
            <InputGroupAddon align={"block-start"} className="pt-1">
              <div className="flex justify-between items-center w-full">
                <Button
                  className="rounded-full"
                  onClick={handleGenerate}
                  size={"xs"}
                  variant={"default"}
                >
                  <Sparkles /> Generate Prompts
                </Button>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size={"icon-xs"}
                    onClick={handleDownload}
                    variant={"outline"}
                  >
                    <Download />
                  </Button>
                  <Button
                    size={"icon-xs"}
                    onClick={handleCopy}
                    variant={"outline"}
                  >
                    <Copy />
                  </Button>
                </div>
              </div>
            </InputGroupAddon>
          </InputGroup>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
};

export default TranscribedCard;
