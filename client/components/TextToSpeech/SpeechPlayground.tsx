"use client";
import ChooseVoice from "@/components/ChooseVoice";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import BottomSheet from "@/components/TextToSpeech/BottomSheet";
import { VoiceGeneration, VoiceInfo } from "@/lib/type";

import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import VoiceHistory from "./VoiceHistory";

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
    <div className="size-full flex flex-col">
      <div className="w-full h-full flex ">
        <InputGroup className="min-h-0 bg-background! max-w-4xl mx-auto px-0 dark:has-disabled:bg-input/30 pt-2 has-disabled:opacity-100 flex-1 rounded-none has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
          <InputGroupTextarea
            onChange={(e) => setText(e.target.value)}
            placeholder="Start type here or paste..."
            className=" h-full pt-5 px-10 scroll-fade scrollbar-thin scrollbar-thumb-accent text-sm text-balance"
          />
          <InputGroupAddon
            align={"block-end"}
            className="flex flex-col px-0 pb-5"
          >
            <AnimatePresence>
              {text && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{
                    duration: 0.4,
                  }}
                  className="flex items-center justify-between w-full px-2"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </InputGroupAddon>
        </InputGroup>

        <VoiceHistory setAudioUrl={setAudioUrl} initialHistory={initialHistory} />
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
