import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { PopoverContent } from "../ui/popover";
import { useState } from "react";

type Quality = "Quick" | "Standard" | "Ultra";
type Resolution = "1K" | "2K" | "4K";

const qualites: Quality[] = ["Quick", "Standard", "Ultra"];
const resolutions: Resolution[] = ["1K", "2K", "4K"];

const ConfigPopover = () => {
  const [quality, setQuality] = useState<Quality>("Ultra");
  const [resolution, setResolution] = useState<Resolution>("2K");

  return (
    <PopoverContent className="w-72" align="center" sideOffset={10} side="top">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          Modal
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between w-full border rounded-2xl px-2 py-1.5">
            <span className="text-sm">GPT Image 2 </span>
            <ChevronRight size={18} />
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          Quality
        </Label>

        <div className="grid grid-cols-3 gap-2">
          {qualites.map((qcl) => (
            <Button
              key={qcl}
              onClick={() => setQuality(qcl)}
              variant={quality === qcl ? "default" : "outline"}
              className="rounded-xl"
            >
              {qcl}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          Resolution
        </Label>

        <div className="grid grid-cols-3 gap-2">
          {resolutions.map((reso) => (
            <Button
              key={reso}
              onClick={() => setResolution(reso)}
              variant={resolution === reso ? "default" : "outline"}
              className="rounded-xl"
            >
              {reso}
            </Button>
          ))}
        </div>
      </div>
    </PopoverContent>
  );
};

export default ConfigPopover;
