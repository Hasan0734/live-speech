import { CommandIcon, CornerDownLeft, ToolCaseIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Transcript } from "@/lib/type";
import ChooseVoice from "./ChooseVoice";
import { v4 as uuidv4 } from "uuid";

interface ChatFormType {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

const TextChatForm = ({ setText, text }: any) => {
  const handleSendText = () => {
    console.log(text.trim());
    if (!text.trim()) return;
    const userMessage: Transcript = {
      id: uuidv4(),
      role: "user",
      text: text.trim(),
    };

    setText("");
  };

  return (
    <div className="w-full flex justify-center mb-5 mt-2 relative h-full">
      <InputGroup className="h-full dark:has-disabled:bg-input/30 has-disabled:opacity-100 has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-0">
        <div className="w-full p-3 h-full">
          <InputGroupTextarea
            onChange={(e) => setText(e.target.value)}
            value={text}
            id="prompt"
            placeholder="Start typing a prompt"
            className="p-0! max-h-full! w-full font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-secondary"
            autoFocus
          />
        </div>

        <InputGroupAddon align="block-end">
          <div className="flex items-center gap-2">
            <InputGroupButton
              disabled
              variant={"secondary"}
              size="xs"
              className="rounded-lg px-3 py-4"
            >
              <ToolCaseIcon /> Tools
            </InputGroupButton>

            <ChooseVoice />
          </div>
          <div className="flex gap-1 items-center justify-end w-full">
            <Button
              disabled={!prompt}
              onClick={handleSendText}
              variant={"secondary"}
              size="xs"
              className="rounded-lg px-3 py-4"
            >
              Run
              <CommandIcon />
              <CornerDownLeft />
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default TextChatForm;
