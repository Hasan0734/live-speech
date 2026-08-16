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

const TranscribedCard = () => {
  return (
    <AccordionItem value="item-1" className="border-b-0!">
      <div className="bg-accent p-2 rounded-xl">
        <AccordionTrigger className="hover:no-underline">
          <div>
            <p className="line-clamp-1">
              ElevenLabs_2026-07-29T17_59_45_Raunk M - Viral & Relatable Reel
              Voice_pvc_sp11_sb61_se-0_b
            </p>
            <p className="text-[10px] text-muted-foreground mt-2">
              2m 32s · Accuracy mode · ~6 creadits used · Jul, 30, 2026, 12:05
              AM · 17d ago
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-0!" asChild>
          <InputGroup className="bg-sidebar! px-0 dark:has-disabled:bg-input/30 pt-2 has-disabled:opacity-100 flex-1 has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:max-h-100 has-[[data-slot=input-group-control]:focus-visible]:scrollbar-thumb-accent">
            <InputGroupTextarea readOnly />
            <InputGroupAddon align={"block-start"} className="pt-1">
              <div className="flex  justify-between items-center w-full">
                <Button
                  className="rounded-full"
                  //   onClick={handleGenerate}
                  size={"xs"}
                  variant={"default"}
                >
                  <Sparkles /> Generate Prompts
                </Button>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size={"icon-xs"}
                    // onClick={handleDownload}
                    variant={"outline"}
                  >
                    <Download />
                  </Button>
                  <Button
                    size={"icon-xs"}
                    // onClick={handleCopy}
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
