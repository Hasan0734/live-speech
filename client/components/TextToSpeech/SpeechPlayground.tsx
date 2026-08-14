"use client";
import { useState } from "react";
import axios from "axios";

import BottomSheet from "@/components/TextToSpeech/BottomSheet";
import { VoiceGeneration, VoiceInfo } from "@/lib/type";

import { toast } from "sonner";
import VoiceHistory from "./VoiceHistory";
import TextInputArea from "./TextInputArea";

interface SpeechPlaygroundProps {
  initialHistory: VoiceGeneration[];
}

const SpeechPlayground = ({ initialHistory }: SpeechPlaygroundProps) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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
        />
      </div>
      {audioUrl && (
        <BottomSheet
          audioUrl={audioUrl}
          isGenerating={loading}
          fileName={`speech-${selectedVoice.name.toLowerCase()}.mp3`}
          voice={resVoice}
          generatedAt="Generated just now"
        />
      )}
    </div>
  );
};

export default SpeechPlayground;
