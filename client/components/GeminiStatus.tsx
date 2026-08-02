import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Marker, MarkerContent } from "./ui/marker";
import { Button } from "./ui/button";
import { PlayIcon, RotateCcwIcon, XIcon } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";
import { Transcript, VoiceInfo } from "@/lib/type";

interface PropsType {
  socket: Socket;
  isConnected: boolean;
  geminiMessage: string;
  statusType: string;
  setTranscripts: Dispatch<SetStateAction<Transcript[]>>;
  selectedVoice: VoiceInfo;
}

const GeminiStatus = ({
  socket,
  isConnected,
  geminiMessage,
  statusType,
  setTranscripts,
  selectedVoice,
}: PropsType) => {
  useEffect(() => {}, []);

  const handleDisconnectStream = () => {
    if (!isConnected) return;
    socket.emit("stream:disconnect");
  };

  const handleResumeStream = () => {
    if (!isConnected) return;
    socket.emit("stream:restart", { voice: selectedVoice.name });
  };

  const handleClearNewChat = () => {
    if (!isConnected) return;
    socket.emit("stream:new-chat");
    setTranscripts([]);
  };

  return (
    <div>
      {geminiMessage && (
        <div className="my-2">
          <Marker variant="separator">
            <MarkerContent className="flex items-center gap-1">
              <p>{geminiMessage}</p>
              {statusType === "LIVE_STREAM" && (
                <div className="flex gap-1">
                  <TooltipWrapper content="Disconnect">
                    <Button
                      onClick={handleDisconnectStream}
                      size={"icon"}
                      variant={"ghost"}
                    >
                      <XIcon />
                    </Button>
                  </TooltipWrapper>
                </div>
              )}

              {statusType === "STOP_STREAM" && (
                <div className="flex gap-1">
                  <TooltipWrapper content="Resume stream">
                    <Button
                      onClick={handleResumeStream}
                      size={"icon"}
                      variant={"ghost"}
                    >
                      <PlayIcon />
                    </Button>
                  </TooltipWrapper>
                  <TooltipWrapper content="Clear the chat to start new stream">
                    <Button
                      onClick={handleClearNewChat}
                      size={"icon"}
                      variant={"ghost"}
                    >
                      <RotateCcwIcon />
                    </Button>
                  </TooltipWrapper>
                </div>
              )}
            </MarkerContent>
          </Marker>
        </div>
      )}
    </div>
  );
};

export default GeminiStatus;
