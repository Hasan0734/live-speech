import React from "react";
import { Textarea } from "../ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { ArrowRight, PlusIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ConfigPopover from "./ConfigPopover";

const PromptBox = () => {
  return (
    <div className="max-w-xl mx-auto w-full pb-2">
      <InputGroup className="min-h-36 bg-sidebar! dark:has-disabled:bg-input/30 has-disabled:opacity-100 flex-1 has-data-[slot=input-group-control]:border-0 rounded-2xl has-[[data-slot=input-group-control]:focus-visible]:ring-0 shadow-xl p-2">
        <InputGroupTextarea
          placeholder="Describe your image... (type @ to add character / environment or reference)"
          className=" h-full scroll-fade scrollbar-thin scrollbar-thumb-accent text-sm text-balance placeholder:text-muted-foreground"
        />
        <InputGroupAddon align={"block-end"} className="cursor-default">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 items-center">
              <InputGroupButton
                variant={"outline"}
                className="rounded-full"
                size={"icon-xs"}
              >
                <PlusIcon />
              </InputGroupButton>
              <Badge variant={"destructive"}>4 Credits</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger className="" asChild>
                  <Badge>
                    GPT Image 2 <span className="opacity-40">·</span>
                    Ultra <span className="opacity-40">·</span>
                    2K <span className="opacity-40">·</span>
                    2:3
                  </Badge>
                </PopoverTrigger>
                <ConfigPopover/>
              </Popover>
              <InputGroupButton
                variant={"secondary"}
                size={"icon-sm"}
                className="rounded-full"
              >
                <ArrowRight />
              </InputGroupButton>
            </div>
          </div>
        </InputGroupAddon>
      </InputGroup>
      <p className="text-xs text-center text-destructive mt-1">
        Need 4 credits, you have 0. Upgrade
      </p>
    </div>
  );
};

export default PromptBox;
