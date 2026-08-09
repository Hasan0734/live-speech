"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  Download,
} from "lucide-react";
import PromptBox from "./PromptBox";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

interface ImagePlaygroundProps {
  projectTitle?: string;
  initialImages?: GeneratedImage[];
  onBack?: () => void;
  onUpdateTitle?: (newTitle: string) => void;
}

const ImagePlayground = ({
  projectTitle = "Aug 9, 2026, 10:10 AM",
  initialImages = [],
  onBack,
  onUpdateTitle,
}: ImagePlaygroundProps) => {
  const [title, setTitle] = useState(projectTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>(initialImages);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isGenerating) return;

    setIsGenerating(true);

    // Simulate image generation (replace with your actual API call)
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", // placeholder
        prompt: promptText,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setImages((prev) => [newImage, ...prev]);
      setPromptText("");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden w-full">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-card/40 backdrop-blur-md z-20">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="rounded-xl border-white/10 bg-background/50 hover:bg-background/80"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {/* Editable Project Title */}
          <div>
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                autoFocus
                onBlur={() => {
                  setIsEditingTitle(false);
                  onUpdateTitle?.(title);
                }}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingTitle(false);
                    onUpdateTitle?.(title);
                  }
                }}
                className="bg-accent/30 border border-white/20 rounded-lg px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors tracking-wide"
                title="Click to rename"
              >
                {title}
              </h1>
            )}
            <p className="text-xs text-muted-foreground">
              {images.length} generated images
            </p>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto p-6 pb-28">
        {images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-white/10 flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">No images generated yet</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Type a prompt below to start creating cinematic visuals for this
                project.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group aspect-square rounded-2xl overflow-hidden bg-accent/20 border border-white/10 shadow-sm"
              >
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Overlay details on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="icon-xs"
                      variant="secondary"
                      className="backdrop-blur-md bg-background/60 hover:bg-background/80 border border-white/10"
                      onClick={() => window.open(img.url, "_blank")}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="destructive"
                      className="backdrop-blur-md"
                      onClick={() =>
                        setImages((prev) => prev.filter((i) => i.id !== img.id))
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <p className="text-xs text-foreground/90 font-medium line-clamp-2 drop-shadow">
                    {img.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PromptBox />
    </div>
  );
};

export default ImagePlayground;
