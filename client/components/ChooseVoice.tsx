import { Play, SpeechIcon } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { InputGroupButton } from "./ui/input-group";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";
import { VoiceInfo } from "@/lib/type";

interface ChooseVoiceProps {
  setSelectedVoice: Dispatch<SetStateAction<VoiceInfo>>;
  selectedVoice: VoiceInfo;
}

const ChooseVoice = ({ setSelectedVoice, selectedVoice }: ChooseVoiceProps) => {
  const [open, setOpen] = React.useState(false);

  const voices = [
    {
      id: "zephyr",
      name: "Zephyr",
      description: "Bright, Higher pitch",
      keyword: ["zephyr", "bright", "higher", "pitch"],
    },
    {
      id: "puck",
      name: "Puck",
      description: "Upbeat, Middle pitch",
      keyword: ["puck", "upbeat", "middle", "pitch"],
    },
    {
      id: "charon",
      name: "Charon",
      description: "Informative, Lower pitch",
      keyword: ["charon", "informative", "lower", "pitch"],
    },
    {
      id: "kore",
      name: "Kore",
      description: "Firm, Middle pitch",
      keyword: ["kore", "firm", "middle", "pitch"],
    },
    {
      id: "fenrir",
      name: "Fenrir",
      description: "Exciteable, Lower middle pitch",
      keyword: ["fenrir", "exciteable", "lower", "middle", "pitch"],
    },
    {
      id: "leda",
      name: "Leda",
      description: "Youthful, Higher Pitch",
      keyword: ["leda", "youthful", "higher", "pitch"],
    },
    {
      id: "orus",
      name: "Orus",
      description: "Firm, Lower middle pitch",
      keyword: ["orus", "firm", "lower", "middle", "pitch"],
    },
    {
      id: "aoede",
      name: "Aoede",
      description: "Breezy, Middle pitch",
      keyword: ["aoede", "breezy", "middle", "pitch"],
    },
    {
      id: "callirrhoe",
      name: "Callirrhoe",
      description: "Easy-going, Middle pitch",
      keyword: ["callirrhoe", "easy-going", "middle", "pitch"],
    },
    {
      id: "autonoe",
      name: "Autonoe",
      description: "Breezy, Middle pitch",
      keyword: ["autonoe", "breezy", "middle", "pitch"],
    },
    {
      id: "enceladus",
      name: "Enceladus",
      description: "Breathy, Lower pitch",
      keyword: ["enceladus", "breathy", "lower", "pitch"],
    },
    {
      id: "lpapetus",
      name: "Lapetus",
      description: "Clear, Lower middle pitch",
      keyword: ["lpapetus", "clear", "lower", "middle", "pitch"],
    },
    {
      id: "umbriel",
      name: "Umbriel",
      description: "Easy-going, Lower middle pitch",
      keyword: ["umbriel", "easy-going", "lower", "middle", "pitch"],
    },
    {
      id: "algeiba",
      name: "Algeiba",
      description: "Smooth, Middle pitch",
      keyword: ["algeiba", "smooth", "middle", "pitch"],
    },
    {
      id: "despina",
      name: "Despina",
      description: "Smooth, Middle pitch",
      keyword: ["despina", "smooth", "middle", "pitch"],
    },
    {
      id: "erinome",
      name: "Erinome",
      description: "Clear, Middle pitch",
      keyword: ["erinome", "clear", "middle", "pitch"],
    },
    {
      id: "algenib",
      name: "Algenib",
      description: "Gravelly, Lower pitch",
      keyword: ["algenib", "gravelly", "lower", "pitch"],
    },
    {
      id: "rasalgethi",
      name: "Rasalgethi",
      description: "Informative, Middle ptich",
      keyword: ["rasalgethi", "informative", "middle", "ptich"],
    },
    {
      id: "laomedia",
      name: "Laomedia",
      description: "Upbeat, Higher ptich",
      keyword: ["laomedia", "upbeat", "higher", "ptich"],
    },
    {
      id: "achernar",
      name: "Achernar",
      description: "Soft, HIgher pitch",
      keyword: ["achernar", "soft", "higher", "pitch"],
    },
    {
      id: "alnilam",
      name: "Alnilam",
      description: "Firm, Lower middle pitch",
      keyword: ["alnilam", "firm", "lower", "middle", "pitch"],
    },
    {
      id: "schedar",
      name: "Schedar",
      description: "Even, Lower middle pitch",
      keyword: ["schedar", "even", "lower", "middle", "pitch"],
    },
    {
      id: "gacrux",
      name: "Gacrux",
      description: "Mature, Middle pitch",
      keyword: ["gacrux", "mature", "middle", "pitch"],
    },
    {
      id: "pulcherrima",
      name: "Pulcherrima",
      description: "Forward, Middle pitch",
      keyword: ["pulcherrima", "forward", "middle", "pitch"],
    },
    {
      id: "achird",
      name: "Achird",
      description: "Friendly, Lower middle pitch",
      keyword: ["achird", "friendly", "lower", "middle", "pitch"],
    },
    {
      id: "zubenelgenubi",
      name: "Zubenelgenubi",
      description: "Casual, Lower middle pitch",
      keyword: ["zubenelgenubi", "casual", "lower", "middle", "pitch"],
    },
    {
      id: "vindemiatrix",
      name: "Vindemiatrix",
      description: "Gentle, Middle pitch",
      keyword: ["vindemiatrix", "gentle", "middle", "pitch"],
    },
    {
      id: "sadachbia",
      name: "Sadachbia",
      description: "Lively, Lower pitch",
      keyword: ["sadachbia", "lively", "lower", "pitch"],
    },
    {
      id: "sadaltager",
      name: "Sadaltager",
      description: "Knowledgeable, Middle pitch",
      keyword: ["sadaltager", "knowledgeable", "middle", "pitch"],
    },
    {
      id: "sulafat",
      name: "Sulafat",
      description: "Warm, Middle pitch",
      keyword: ["sulafat", "warm", "middle", "pitch"],
    },
  ];
  return (
    <>
      <InputGroupButton
        onClick={() => setOpen(true)}
        variant={"secondary"}
        size="xs"
        className="rounded-lg px-3 py-4"
      >
        <SpeechIcon /> {selectedVoice?.name}
      </InputGroupButton>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder=" name search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {voices.map((voice) => (
                <CommandItem
                  key={voice.id}
                  value={voice.name}
                  keywords={voice.keyword}
                  onSelect={(v) => {
                    setOpen(false);
                    setSelectedVoice({ name: v });
                  }}
                >
                  <div className="flex  gap-3 items-center w-full">
                    <Button variant={"secondary"} size={"icon"}>
                      <Play />
                    </Button>
                    <div className="flex flex-col gap-1">
                      <span>{voice.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {voice.description}
                      </span>
                    </div>
                    <div></div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default ChooseVoice;
