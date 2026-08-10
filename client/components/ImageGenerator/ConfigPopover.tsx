import { ChevronRight, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { PopoverContent } from "../ui/popover";
import { use, useState } from "react";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

type Quality = "Quick" | "Standard" | "Ultra";
type Resolution = "1K" | "2K" | "4K";

const qualites: Quality[] = ["Quick", "Standard", "Ultra"];
const resolutions: Resolution[] = ["1K", "2K", "4K"];
const ratios = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"];


const models = [
    {
        id: 1,
        name: "GPT Image 2"
    }
]



const ConfigPopover = () => {
  const [quality, setQuality] = useState<Quality>("Quick");
  const [resolution, setResolution] = useState<Resolution>("1K");
  const [ratio, setRatio] = useState("2:3");

  return (
    <PopoverContent
      className="w-72 rounded-2xl p-4"
      align="center"
      sideOffset={10}
      side="top"
    >
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          Modal
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between w-full border rounded-2xl px-2 py-1.5">
            <span className="text-xs">GPT Image 2 </span>
            <ChevronRight size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className=""
            align="end"
            side="left"
            sideOffset={20}
          >
            {/* <div className="flex items-center justify-between">
              <span className="uppercase text-sm">Model</span>
              <span>
                <XIcon size={16} />
              </span>
            </div> */}
            <DropdownMenuGroup>
                <DropdownMenuItem>

                </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
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
              className="rounded-xl text-xs"
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
              className="rounded-xl text-xs!"
            >
              {reso}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">
          Aspect Ratio
        </Label>

        <div className="grid grid-cols-5 gap-2">
          {ratios.map((rat) => (
            <Button
              key={rat}
              onClick={() => setRatio(rat)}
              variant={ratio === rat ? "default" : "outline"}
              className="rounded-xl text-xs!"
            >
              {rat}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">0 credits available</span>
        <span className="font-semibold">4 creadis needed</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs">Auto Download</Label>
          <span className="text-[10px] text-muted-foreground">
            Save image automatically after generation
          </span>
        </div>
        <Switch />
      </div>
    </PopoverContent>
  );
};

export default ConfigPopover;
