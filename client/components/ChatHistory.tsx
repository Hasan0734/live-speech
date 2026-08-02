import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Transcript } from "@/lib/type";
import { useEffect, useRef } from "react";
import { ThinkingOrb } from "thinking-orbs";

interface ChatHistory {
  transcripts: Transcript[];
}

const ChatHistory = ({ transcripts }: ChatHistory) => {
  return (
    <div className="w-full flex justify-end min-h-0 items-end overflow-y-auto pl-3 pr-5 scrollbar-thin">
      <div className="w-full flex flex-col gap-6">
        {transcripts.map((transcript, index) => (
          <MessageItem
            key={transcript.id || index + transcript.text.slice(0, 10)}
            transcript={transcript}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;

const MessageItem = ({
  transcript,
}: {
  transcript: Transcript;
}) => {
  const isModel = transcript.role === "model";
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <Message align={isModel ? "start" : "end"} >
      <MessageContent >
        {transcript.isPlaying && <ThinkingOrb state="composing" size={64} />}

        {!transcript?.isPlaying && isModel && transcript.audioUrl && (
          <audio
            ref={audioRef}
            src={transcript.audioUrl}
            controls
            className=" rounded-lg"
          />
        )}

        <Bubble variant={isModel ? "ghost" : "secondary"}>
          <BubbleContent className="flex flex-col gap-3">
            {/* Render Native Audio Tag whenever audio is attached */}

            {/* Realtime streaming text display */}
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {transcript.text}
            </p>
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  );
};
