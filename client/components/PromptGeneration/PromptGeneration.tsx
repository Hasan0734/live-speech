"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "radix-ui/select";
import { Card, CardContent } from "../ui/card";
import { ChevronRightIcon } from "lucide-react";

const PromptGeneration = () => {
  const [script, setScript] = useState("");
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Generate Image Propmts
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste your timestamped script to generate prompts for each segment.
        </p>
      </div>
      <div className="w-full flex-col flex gap-4">
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="script">Your Script</Label>
            <div>0/20000</div>
          </div>
          <Textarea
            onChange={(e) => setScript(e.target.value)}
            name="script"
            id="script"
            className="min-h-80 max-h-80 resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Video Style</Label>
          <Select>
            <SelectTrigger className="w-full h-11!">
              <SelectValue placeholder="Styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doodle/whiteboard">
                Doodle / Whiteboard
              </SelectItem>
              <SelectItem value="2d-cartoon">2D Cartoon</SelectItem>
              <SelectItem value="2d-cinamatic">
                2D Cinematic (Anime/Ghibli)
              </SelectItem>
              <SelectItem value="3d-stylized">3D Stylized (Pixar)</SelectItem>
              <SelectItem value="3d-realistic">
                3D Realistic (Cinematic CGI)
              </SelectItem>
              <SelectItem value="live-action-realistic">
                Live Action Realistic
              </SelectItem>
              <SelectItem value="historical-ancient">
                Historical / Ancient
              </SelectItem>
              <SelectItem value="fastasy-scifi-concept-art">
                Fantasy / Sci-Fi Concept Art
              </SelectItem>
              <SelectItem value="retro-pixel-art">Retro / Pixel Art</SelectItem>
              <SelectItem value="abstract-artistic">
                Abstract / Artistic
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-card rounded-xl w-full p-4">
          <h2 className="text-xl font-medium">
            Character & Environment Consistency
          </h2>
          <div>
            <p className="text-sm text-muted-foreground">
              Keep characters and environments visually consistent across all
              scenes
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-blue-500">How to use this?</span>{" "}
            <ChevronRightIcon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGeneration;
