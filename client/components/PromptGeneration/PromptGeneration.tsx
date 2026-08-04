"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface TIMELINE {
  time: string;
  prompt: string;
}

const PromptGeneration = () => {
  const [script, setScript] = useState("");
  const [style, setStyle] = useState("");
  const [consistency, setConsistency] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TIMELINE[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);

  const MAX_CHARS = 20000;

  const handleGenerate = async () => {
    if (!script.trim()) return;

    setLoading(true);

    // Simulate generation process (Replace with your actual API call)
    setTimeout(() => {
      setResults([
        {
          time: "[0:00]",
          prompt:
            "Cinematic establishing shot of an ancient valley, misty morning light, highly detailed historical realism, 8k resolution",
        },
        {
          time: "[0:06]",
          prompt:
            "Close up of an archaeologist examining weathered stone artifacts, dramatic side lighting, rich textures, professional cinematography",
        },
        {
          time: "[0:16]",
          prompt:
            "Abstract visual representation of thought and memory, glowing ethereal particles weaving through ancient ruins, cosmic atmosphere",
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  const handleCopy = (text: string, index: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8 w-full select-none">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Generate Image Prompts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transform your timestamped scripts into production-ready visual
            prompts.
          </p>
        </div>
        {results && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResults(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Editor
          </Button>
        )}
      </div>

      {!results ? (
        /* --- Input Form View --- */
        <div className="space-y-6">
          {/* Script Textarea Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="script"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Timestamped Script
              </Label>
              <span className="text-xs text-muted-foreground font-mono">
                {script.length} / {MAX_CHARS}
              </span>
            </div>
            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              name="script"
              id="script"
              placeholder="[0:00] Paste your script lines here with timestamps..."
              maxLength={MAX_CHARS}
              className="min-h-[220px] max-h-[220px] resize-none font-mono text-sm leading-relaxed p-4 rounded-xl border-border bg-card/50"
            />
          </div>

          {/* Video Style Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Video Visual Style
            </Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-full h-11 rounded-xl border-border bg-card/50 text-foreground">
                <SelectValue placeholder="Select your target video aesthetic..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="doodle">Doodle / Whiteboard</SelectItem>
                <SelectItem value="2d-cartoon">2D Cartoon</SelectItem>
                <SelectItem value="2d-cinematic">
                  2D Cinematic (Anime / Ghibli)
                </SelectItem>
                <SelectItem value="3d-stylized">
                  3D Stylized (Pixar style)
                </SelectItem>
                <SelectItem value="3d-realistic">
                  3D Realistic (Cinematic CGI)
                </SelectItem>
                <SelectItem value="live-action">
                  Live Action Realistic
                </SelectItem>
                <SelectItem value="historical">Historical / Ancient</SelectItem>
                <SelectItem value="scifi">
                  Fantasy / Sci-Fi Concept Art
                </SelectItem>
                <SelectItem value="pixel">Retro / Pixel Art</SelectItem>
                <SelectItem value="abstract">Abstract / Artistic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Consistency Toggle Card */}
          <div className="bg-card border border-border/80 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground">
                  Character & Environment Consistency
                </span>
                <p className="text-xs text-muted-foreground">
                  Lock core features to maintain visual continuity across scene
                  cuts
                </p>
              </div>
              <Switch checked={consistency} onCheckedChange={setConsistency} />
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline flex items-center gap-1">
                How to leverage style seeds?
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* Submit Action Button */}
          <Button
            onClick={handleGenerate}
            disabled={!script.trim() || loading}
            className="w-full h-11 rounded-xl font-semibold gap-2 shadow-sm transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Synthesizing Prompts...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-current" />
                Generate Image Prompts
              </>
            )}
          </Button>
        </div>
      ) : (
        /* --- Results Output View --- */
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Generated Prompts ({results?.length} Segments)
            </h2>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs font-medium"
              onClick={() =>
                handleCopy(
                  results.map((r) => `${r.time} ${r.prompt}`).join("\n"),
                  "all",
                )
              }
            >
              {copiedIndex === "all" ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copiedIndex === "all" ? "Copied All" : "Copy Full Script"}
            </Button>
          </div>

          <div className="space-y-3">
            {results.map((item, index) => (
              <Card
                key={index}
                className="border border-border/80 bg-card rounded-xl overflow-hidden shadow-xs hover:border-border transition-colors"
              >
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-accent text-accent-foreground font-mono text-xs font-semibold">
                      {item.time}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed pt-1">
                      {item.prompt}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={() => handleCopy(item.prompt, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            className="w-full h-11 rounded-xl font-semibold mt-6 gap-2"
            onClick={() => setResults(null)}
          >
            Create New Batch
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromptGeneration;
