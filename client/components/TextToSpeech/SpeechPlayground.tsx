"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import BottomSheet from "@/components/TextToSpeech/BottomSheet";
import { VoiceGeneration, VoiceInfo } from "@/lib/type";

import { toast } from "sonner";
import VoiceHistory from "./VoiceHistory";
import TextInputArea from "./TextInputArea";
import { useRouter } from "next/navigation";

interface SpeechPlaygroundProps {
  initialHistory: VoiceGeneration[];
}

const SpeechPlayground = ({ initialHistory }: SpeechPlaygroundProps) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const router = useRouter()

  const [selectedVoice, setSelectedVoice] = useState<VoiceInfo>({
    name: "Zephyr",
    language: "English (US)",
    gender: "Neutral",
    style: "Natural",
    provider: "Gemini",
  });

  const [resVoice, setResVoice] = useState({
    name: "",
    language: "English (US)",
    gender: "Neutral",
    style: "Natural",
    provider: "Gemini",
  });

  const handleGenerate = async () => {
    setLoading(true);
    if (!text.trim() && text.length <= 5000) return;

    try {
      const res = await axios.post(`/api/voice-generation`, {
        text,
        voice: selectedVoice.name,
      });

      setAudioUrl(res.data.audioUrl);
      setResVoice((prev) => ({ ...prev, name: res.data.voiceUsed }));
      router.refresh();
      setSelectedId(null);
      setLoading(false);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Something is wrong! Try later");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = async (): Promise<void> => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) return;

    try {
      if (audio.paused) {
        setIsAudioLoading(true);
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      setIsAudioLoading(false);
      console.error("Audio playback failed:", error);
    }
  };

  useEffect(() => {
    setAudioUrl(null);
    setIsPlaying(false)
  }, [text]);

  return (
    <div className="size-full flex flex-col relative translate-[0,0]">
      <div className="w-full h-full flex ">
        <TextInputArea
          text={text}
          setText={setText}
          loading={loading}
          handleGenerate={handleGenerate}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
        />

        <VoiceHistory
          setAudioUrl={setAudioUrl}
          initialHistory={initialHistory}
          togglePlay={togglePlay}
          isPlaying={isPlaying}
          audioUrl={audioUrl}
          setSelectedId={setSelectedId}
          selectedId={selectedId}
          setText={setText}
        />
      </div>
      {audioUrl && (
        <BottomSheet
          audioUrl={audioUrl}
          isGenerating={loading}
          fileName={`speech-${selectedVoice.name.toLowerCase()}.mp3`}
          voice={resVoice}
          generatedAt="Generated just now"
          setIsAudioLoading={setIsAudioLoading}
          isAudioLoading={isAudioLoading}
          audioRef={audioRef}
          togglePlay={togglePlay}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
        />
      )}
    </div>
  );
};

export default SpeechPlayground;
