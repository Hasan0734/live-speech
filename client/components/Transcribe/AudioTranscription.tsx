"use client";
import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import ModeSelection from "./ModeSelection";
import DropZone from "./DropZone";
import SelectLanguage from "./SelectLanguage";
import { Button } from "../ui/button";
import AudioPreview from "./AudioPreview";
import { AnimatePresence } from "motion/react";
import axios from "axios";
import { API_URL } from "@/lib/utils";
import { toast } from "sonner";
import Transcribing from "./Transcribing";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { useRouter } from "next/navigation";

const steps = [
  { number: "1", label: "Upload audio", active: true },
  { number: "2", label: "Select language", active: false },
  { number: "3", label: "Transcribe", active: false },
  { number: "4", label: "Whisper detects pauses", active: false },
  { number: "5", label: "Download transcript", active: false },
];

type UploadResult = {
  key: string | null;
  uploading: boolean;
};

export default function AudioTranscription() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc Hello world this new bangladesh and the artisc ");
  const [status, setStatus] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedMode, setSelectedMode] = useState<"fast" | "accuracy">("fast");

  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const cancelTracker = useRef<AbortController | null>(null);

  const router = useRouter();

  const onFileSelect = async (file: File) => {
    if (file.type.startsWith("video")) {
      toast.error("Accept only audio, type WAV, MP3");
      return;
    }

    setIsUploading(true);
    setAudioFile(file);
    const audioUrl = URL.createObjectURL(file);
    setAudioSrc(audioUrl);

    const formData = new FormData();
    formData.append("file", file);

    cancelTracker.current = new AbortController();

    try {
      setUploadResult({ key: null, uploading: true });
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: cancelTracker.current.signal,
        onUploadProgress: (event) => {
          const total = event.total || 1;
          const currentPercentage = Math.round((event.loaded * 100) / total);
          setUploadProgress(currentPercentage);
        },
      });

      if (res.data.key) {
        setUploadResult({ key: res.data.key, uploading: false });
      }

      toast.success("File uploaded.");
      setUploadFinished(true);
    } catch (error: any) {
      setIsUploading(false);
      if ((error.message = "canceled")) {
        return;
      }
      toast.error("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearAudioState = () => {
    if (cancelTracker.current) {
      cancelTracker.current.abort();
      cancelTracker.current = null;
      setAudioFile(null);
      setAudioSrc("");
      setUploadProgress(0);
      setUploadResult(null);
    }
  };

  const handleTranscribe = async () => {
    if (!uploadResult?.key) return;

    setTranscribing(true);
    const data = {
      key: uploadResult.key,
      mimetype: audioFile?.type,
      language: selectedLanguage,
      mode: selectedMode,
    };

    setTranscriptionText("");
    setStatus("transcribing");
    try {
      const response = await fetch(`${API_URL}/api/transcribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkString = decoder.decode(value);
        const lines = chunkString.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const rawData = line.replace("data: ", "").trim();
            if (rawData === "[DONE]") {
              setStatus("success");
              break;
            }

            try {
              const parsed = JSON.parse(rawData);
              if (parsed.text) {
                // Smoothly append the text block to your UI transcription string state
                setTranscriptionText((prev) => prev + parsed.text);
              }
            } catch (e) {
              // Ignore incomp
            }
          }
        }
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setTranscribing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcriptionText);
      toast.success("Text copied successfully!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copied text.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcriptionText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${audioFile?.name}-transcribed.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    sessionStorage.setItem("promptScript", transcriptionText);
    router.push("/prompt-generation");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans ">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Turn Audio Into{" "}
          <span className="text-muted-foreground font-normal text-2xl">
            Accurate Text
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload any audio <span className="text-foreground">→</span> Select
          Language <span className="text-foreground">→</span> timestamped
          transcript ready
        </p>
      </div>

      {/* Steps Badge Row */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {steps.map((step, idx) => (
          <Badge key={idx} variant={"secondary"}>
            <span>{step.number} ·</span>
            <span>{step.label}</span>
          </Badge>
        ))}
      </div>

      <AnimatePresence>
        {audioFile ? (
          <AudioPreview
            clearAudioState={clearAudioState}
            audioSrc={audioSrc}
            audioFile={audioFile}
            uploadProgress={uploadProgress}
            uploadFinished={uploadFinished}
            isUploading={isUploading}
            uploadResult={uploadResult}
          />
        ) : (
          <DropZone onFileSelect={onFileSelect} />
        )}
      </AnimatePresence>

      <ModeSelection
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
      />

      <div className="text-xs  mb-6 text-muted-foreground">
        You have{" "}
        <strong className="text-foreground font-semibold">4 credits</strong> of
        credits remaining.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <SelectLanguage
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
        <div className="sm:col-span-3">
          <Button
            onClick={handleTranscribe}
            disabled={
              uploadResult === null
                ? true
                : uploadResult.uploading
                  ? true
                  : transcribing
                    ? true
                    : false
            }
            size={"lg"}
            className="w-full h-12  font-medium text-base py-3.5 px-6 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            {uploadResult === null
              ? "Transcribe Audio"
              : uploadResult.uploading
                ? "Wait for uploading"
                : transcribing
                  ? "Transcribing"
                  : "Transcribe Audio"}
          </Button>
        </div>
      </div>

      {transcribing && <Transcribing />}

      {transcriptionText && (
        <div className="mt-6 rounded-xl">
          {/* <div className="flex items-center justify-between mb-4">
            <Button>
              <Sparkles /> Generate prompt
            </Button>
          </div> */}
          <InputGroup className="bg-card max-w-4xl mx-auto px-0 dark:has-disabled:bg-input/30 pt-2 has-disabled:opacity-100 flex-1 has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:max-h-100 has-[[data-slot=input-group-control]:focus-visible]:scrollbar-thumb-accent">
            <InputGroupTextarea value={transcriptionText} readOnly />
            <InputGroupAddon align={"block-start"}>
              <div className="flex  justify-between items-center w-full">
                <InputGroupButton
                  onClick={handleGenerate}
                  size={"sm"}
                  variant={"default"}
                >
                  <Sparkles /> Generate prompt
                </InputGroupButton>
                <div className="flex items-center justify-end gap-2">
                  <InputGroupButton
                    size={"sm"}
                    onClick={handleDownload}
                    variant={"outline"}
                  >
                    Download
                  </InputGroupButton>
                  <InputGroupButton
                    size={"sm"}
                    onClick={handleCopy}
                    variant={"outline"}
                  >
                    Copy
                  </InputGroupButton>
                </div>
              </div>
            </InputGroupAddon>
          </InputGroup>
          {/* <Textarea
            value={transcriptionText}
            readOnly
            name="script"
            id="script"
            placeholder="[0:00] Paste your script lines here with timestamps..."
            className="min-h-55 max-h-100 bg-background! focus-visible:ring-0 scrollbar-thin scrollbar-thumb-accent py-2 resize-none font-mono text-sm leading-relaxed p-4 rounded-xl border-border"
          /> */}
        </div>
      )}
    </div>
  );
}
