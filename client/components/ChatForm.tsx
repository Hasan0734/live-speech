import {
  AudioLinesIcon,
  CommandIcon,
  CornerDownLeft,
  MicIcon,
  ScreenShareIcon,
  SpeechIcon,
  ToolCaseIcon,
  VideoIcon,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import TooltipWrapper from "./TooltipWrapper";
import { ThinkingOrb } from "thinking-orbs";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Socket } from "socket.io-client";
import { Transcript, VoiceInfo } from "@/lib/type";
import { v4 as uuidv4 } from "uuid";
import ChooseVoice from "./ChooseVoice";

interface ChatFormType {
  isRecording: boolean;
  isCameraActive: boolean;
  isScreenSharing: boolean;
  toggleRecording: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  socket: Socket | null;
  setTranscripts: Dispatch<SetStateAction<Transcript[]>>;
  selectedVoice: VoiceInfo;
  setSelectedVoice: Dispatch<SetStateAction<VoiceInfo>>;
}

const ChatForm = ({
  isCameraActive,
  isRecording,
  isScreenSharing,
  toggleCamera,
  toggleRecording,
  toggleScreenShare,
  socket,
  setTranscripts,
  selectedVoice,
  setSelectedVoice,
}: ChatFormType) => {
  const [prompt, setPrompt] = useState("");

  const handleSendText = () => {
    if (!prompt.trim() || !socket?.connected) return;
    const userMessage: Transcript = {
      id: uuidv4(),
      role: "user",
      text: prompt.trim(),
    };
    setTranscripts((prev) => [...prev, userMessage]);
    socket.emit("text:prompt", {
      prompt: prompt.trim(),
      voice: selectedVoice.name,
    });
    setPrompt("");
  };

  return (
    <div className="w-full flex justify-center mb-5 mt-2 relative">
      <InputGroup className="dark:has-disabled:bg-input/30 has-disabled:opacity-100 has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-0">
        <div className="w-full p-3">
          <InputGroupTextarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            id="prompt"
            placeholder="Start typing a prompt"
            className="p-0! w-full font-mono text-sm max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary"
            autoFocus
          />
        </div>

        <InputGroupAddon align="block-end">
          <div className="flex items-center gap-2">
            {socket?.connected ? (
              <TooltipWrapper content="Connected">
                <span
                  className="block size-2 bg-green-600 rounded-full animate-pulse transition-all"
                  style={{ animationDuration: "1500ms" }}
                ></span>
              </TooltipWrapper>
            ) : (
              <TooltipWrapper content="Main server disconnected.">
                <span
                  className="block size-2 bg-red-500 rounded-full animate-pulse transition-all"
                  style={{ animationDuration: "1500ms" }}
                ></span>
              </TooltipWrapper>
            )}
            <InputGroupButton
              disabled
              variant={"secondary"}
              size="xs"
              className="rounded-lg px-3 py-4"
            >
              <ToolCaseIcon /> Tools
            </InputGroupButton>

            <ChooseVoice
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
            />
          </div>
          <div className="flex gap-1 items-center justify-end w-full">
            <div
              className={cn(
                "bg-secondary rounded-[10px] gap-1 flex items-center ",
                {
                  "pl-2": isRecording,
                },
              )}
            >
              {/* <AudioLinesIcon className="size-4"/> */}
              {isRecording && (
                <ThinkingOrb
                  color="#ffeebb"
                  className="fill-green-400"
                  state="composing"
                  size={20}
                />
              )}
              <TooltipWrapper content="Start recording">
                <InputGroupButton
                  onClick={toggleRecording}
                  variant={"secondary"}
                  size={"icon-sm"}
                  className={cn({ "bg-blue-500": isRecording })}
                >
                  <MicIcon />
                </InputGroupButton>
              </TooltipWrapper>
            </div>
            <TooltipWrapper
              disabled={isScreenSharing}
              content="Select camera source"
            >
              <InputGroupButton
                disabled
                onClick={toggleCamera}
                variant={"secondary"}
                size={"icon-sm"}
                className={cn({ "bg-blue-500": isCameraActive })}
              >
                <VideoIcon />
              </InputGroupButton>
            </TooltipWrapper>
            <TooltipWrapper
              disabled={isCameraActive}
              content="Start screen sharing"
            >
              <InputGroupButton
                disabled
                onClick={toggleScreenShare}
                variant={"secondary"}
                size={"icon-sm"}
                className={cn({ "bg-blue-500": isScreenSharing })}
              >
                <ScreenShareIcon />
              </InputGroupButton>
            </TooltipWrapper>

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

export default ChatForm;
