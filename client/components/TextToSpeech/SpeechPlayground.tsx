"use client";
import ChooseVoice from "@/components/ChooseVoice";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import BottomSheet from "@/components/TextToSpeech/BottomSheet";
import { VoiceInfo } from "@/lib/type";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const SpeechPlayground = () => {
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
      const res = await axios.post(`${API_URL}/text-to-speech`, {
        text,
        voice: selectedVoice.name,
      });

      if (res.data) {
        setAudioUrl(res.data.audioUrl);
        setResVoice((prev) => ({ ...prev, name: res.data.voiceUsed }));
      }

      //   const audioBlob = await res.blob();
      //   const nextAudioUrl = URL.createObjectURL(audioBlob);

      setLoading(false);
    } catch (error: any) {
      console.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <InputGroup className="min-h-0 bg-background! max-w-4xl mx-auto px-0 dark:has-disabled:bg-input/30 pt-2 has-disabled:opacity-100 flex-1 rounded-none has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
        {/* <InputGroupAddon align={"block-start"} className="border-b">
        <Link href="/">
          <Button size={"icon"} variant={"secondary"}>
            <ArrowLeft />
          </Button>
        </Link>
      </InputGroupAddon> */}
        <InputGroupTextarea
          onChange={(e) => setText(e.target.value)}
          placeholder="Start type here or paste..."
          className=" h-full pt-5 px-10 scroll-fade scrollbar-thin scrollbar-thumb-accent text-sm text-balance"
        />
        <InputGroupAddon align={"block-end"} className="flex flex-col px-0">
          <div className="flex items-center justify-between w-full px-2">
            <div>
              <ChooseVoice
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
              />
            </div>
            <div className="flex justify-end gap-3 items-center">
              <span className="text-muted-foreground text-sm">
                {text.length}/ 5000
              </span>
              <Button
                size={"lg"}
                disabled={loading}
                onClick={handleGenerate}
                variant={"secondary"}
              >
                {loading ? (
                  <>
                    <Spinner /> Generating...
                  </>
                ) : (
                  "Generate speech"
                )}
              </Button>
            </div>
          </div>
        </InputGroupAddon>
      </InputGroup>
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
