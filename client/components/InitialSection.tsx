import React from "react";
import { Button } from "./ui/button";
import { MicIcon, ScreenShareIcon, VideoIcon } from "lucide-react";

interface InitalTypes {
  toggleRecording: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
}

const InitialSection = ({ toggleRecording, toggleCamera, toggleScreenShare }: InitalTypes) => {
  return (
      <div>
        <h1 className="text-2xl font-semibold text-foreground text-center">
          Try the Live API
        </h1>
        <div className="flex gap-2 items-center mt-3">
          <Button
            onClick={toggleRecording}
            variant={"secondary"}
            size={"lg"}
            className="rounded-lg"
          >
            <MicIcon /> Talk
          </Button>
          <Button disabled onClick={toggleCamera} variant={"secondary"} size={"lg"} className="rounded-lg">
            <VideoIcon /> Webcam
          </Button>
          <Button disabled onClick={toggleScreenShare} variant={"secondary"} size={"lg"} className="rounded-lg">
            <ScreenShareIcon /> Share Screen
          </Button>
        </div>
      </div>
  );
};

export default InitialSection;
