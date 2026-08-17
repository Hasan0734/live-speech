"use client";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import ModeSelection from "./ModeSelection";
import DropZone from "./DropZone";
import SelectLanguage from "./SelectLanguage";
import { Button } from "../ui/button";
import AudioPreview from "./AudioPreview";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";
import { API_URL } from "@/lib/utils";
import { toast } from "sonner";
import Transcribing from "./Transcribing";

import { useRouter } from "next/navigation";
import TranscribedPreview from "./TranscribedPreview";
import TranscribeHeading from "./TranscribeHeading";
import TranscribeSidebar from "./TranscribeSidebar";
import { Spinner } from "../ui/spinner";
import { Transcribe } from "@/lib/type";

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

interface AudioTranscriptionProps {
  initialHistory: Transcribe[]
}

export default function AudioTranscription({initialHistory}: AudioTranscriptionProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");
  const [status, setStatus] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedMode, setSelectedMode] = useState<"fast" | "accuracy">("fast");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const cancelTracker = useRef<AbortController | null>(null);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const router = useRouter()

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = (): void => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : null);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioFile]);

  const onFileSelect = async (file: File) => {
    setTranscriptionText("");
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
      const res = await axios.post(`/api/upload-audio`, formData, {
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
    setTranscriptionText("")
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
      file_name: audioFile?.name,
      duration,
    };

    setTranscriptionText("");
    setStatus("transcribing");
    try {
      const response = await fetch(`/api/transcribe`, {
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

      router.refresh()
    } catch (err) {
      setStatus("error");
    } finally {
      setTranscribing(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  return (
    <div className="flex w-full">
      {/* sm:px-10 2xl:px-30 scroll-fade */}
      <motion.div className="w-full lg:max-w-4xl mx-auto 2xl:px-20 min-h-[calc(100vh-56px)] scroll-fade p-6 font-sans overflow-y-scroll scrollbar-thin scrollbar-thumb-accent">
        <TranscribeHeading />
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
              duration={duration}
              audioRef={audioRef}
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
          <strong className="text-foreground font-semibold">4 credits</strong>{" "}
          of credits remaining.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <SelectLanguage

            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <div className="sm:col-span-3 md:col-span-3 lg:col-span-3 xl:col-span-3">
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
                  ? <><Spinner/> Wait for uploading</>
                  : transcribing
                    ? <><Spinner/> Transcribing..</>
                    : "Transcribe Audio"}
            </Button>
          </div>
        </div>

        {transcribing && <Transcribing />}

        {transcriptionText && (
          <TranscribedPreview
            audioFile={audioFile}
            transcriptionText={transcriptionText}
          />
        )}
      </motion.div>

     {initialHistory.length > 0 && <TranscribeSidebar  initialHistory={initialHistory}/>}
    </div>
  );
}
