import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "motion/react";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const DropZone = ({ onFileSelect }: DropZoneProps) => {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);

    onFileSelect(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "spring",
        damping: 50,
        stiffness: 100,
      }}
      onClick={() => inputRef?.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={cn(
        "border-2 border-dashed rounded-2xl p-8 text-center bg-card cursor-pointer mb-6 transition-all",
        {
          "border-primary bg-primary/5 scale-[1.01]": isDragging,
        },
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) =>
          e.target.files ? handleFile(e?.target?.files[0]) : null
        }
      />

      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center shadow-sm">
        <Upload className="w-5 h-5 text-background" />
      </div>

      <h3 className="text-base font-semibold mb-1">
        {fileName
          ? `Selected: ${fileName}`
          : "Drop audio here or click to browse"}
      </h3>
      <p className="text-xs text-muted-foreground mb-6">
        MP3 · WAV · M4A · OGG · FLAC · WebM · Max 50MB
      </p>

      <div
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-xs font-medium shadow-sm"
      >
        <span>💡 Have audio in multiple parts?</span>
        <button className="underline underline-offset-2 hover:text-slate-200 font-semibold cursor-pointer">
          Merge them first
        </button>
        <span className="text-slate-300 font-normal">for best results.</span>
      </div>
    </motion.div>
  );
};

export default DropZone;
