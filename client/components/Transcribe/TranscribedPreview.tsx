import { Sparkles } from "lucide-react";
import React from "react";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from "../ui/input-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface TranscribedProps {
  transcriptionText: string;
  audioFile: File | null;
}

const TranscribedPreview = ({
  transcriptionText,
  audioFile,
}: TranscribedProps) => {
  const router = useRouter();
  const handleGenerate = () => {
    sessionStorage.setItem("promptScript", transcriptionText);
    router.push("/dashboard/prompt-generation");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcriptionText);
      toast.success("Text copied successfully!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copied text.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcriptionText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${audioFile?.name}-transcribed.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 rounded-xl">
 
      <InputGroup className="bg-card  px-0 dark:has-disabled:bg-input/30 pt-2 has-disabled:opacity-100 flex-1 has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:max-h-100 has-[[data-slot=input-group-control]:focus-visible]:scrollbar-thumb-accent">
        <InputGroupTextarea value={transcriptionText} readOnly />
        <InputGroupAddon align={"block-start"}>
          <div className="flex  justify-between items-center w-full">
            <Button
              onClick={handleGenerate}
              size={"sm"}
              variant={"default"}
              className="rounded-full"
            >
              <Sparkles /> Generate prompt
            </Button>
            <div className="flex items-center justify-end gap-2">
              <Button
                size={"sm"}
                onClick={handleDownload}
                variant={"secondary"}
              >
                Download
              </Button>
              <Button
                size={"sm"}
                onClick={handleCopy}
                variant={"secondary"}
              >
                Copy
              </Button>
            </div>
          </div>
        </InputGroupAddon>
      </InputGroup>
      {/* <Textarea
            value={transcriptionText}
            readOnly
            name="script"
            id="script"
            placeholder="[0:00] Paste your script lines here with timestamps..."
            className="min-h-55 max-h-100 bg-background! focus-visible:ring-0 scrollbar-thin scrollbar-thumb-accent py-2 resize-none font-mono text-sm leading-relaxed p-4 rounded-xl border-border"
          /> */}
    </div>
  );
};

export default TranscribedPreview;
