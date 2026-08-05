"use client";
import React, { useState } from "react";
import { Upload, Zap, Target, Info, ChevronDown } from "lucide-react";
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

const steps = [
  { number: "1", label: "Upload audio", active: true },
  { number: "2", label: "Select language", active: false },
  { number: "3", label: "Transcribe", active: false },
  { number: "4", label: "Whisper detects pauses", active: false },
  { number: "5", label: "Download transcript", active: false },
];

export default function AudioTranscription() {
  const [selectedMode, setSelectedMode] = useState("fast");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFinished, setUploadFinished] = useState(false);

  const [uploadResult, setUploadResult] = useState(null);

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

    try {
      await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const total = event.total || 1;
          const currentPercentage = Math.round((event.loaded * 100) / total);
          console.log(currentPercentage);
          setUploadProgress(currentPercentage);
        },
      });

      toast.success("File uploaded.");
      setUploadFinished(true);
    } catch (error) {
      console.log(error);
      toast.error("Upload failed. Try again.");
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
  };

  const clearAudioState = () => {
    setAudioFile(null);
    setAudioSrc("");
  };


  console.log(uploadProgress)

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
          />
        ) : (
          <DropZone onFileSelect={onFileSelect} />
        )}
      </AnimatePresence>

      <ModeSelection />

      <div className="text-xs  mb-6 text-muted-foreground">
        You have{" "}
        <strong className="text-foreground font-semibold">4 credits</strong> of
        credits remaining.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <SelectLanguage />
        <div className="sm:col-span-3">
          <Button
            disabled
            size={"lg"}
            className="w-full h-12  font-medium text-base py-3.5 px-6 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Transcribe Audio
          </Button>
        </div>
      </div>
    </div>
  );
}
