import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@/components/ui/field";
import { Info, Target, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { Dispatch, SetStateAction } from "react";

interface ModeSelectionProps {
  selectedMode: "fast" | "accuracy";
  setSelectedMode: Dispatch<SetStateAction<"fast" | "accuracy">>;
}

const ModeSelection = ({
  selectedMode,
  setSelectedMode,
}: ModeSelectionProps) => {
  return (
    <RadioGroup
      defaultValue="fast"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      onValueChange={(v: "fast" | "accuracy") => setSelectedMode(v)}
    >
      <FieldLabel
        htmlFor="fast"
        className="has-[>[data-slot=field]]:rounded-xl"
      >
        <Field className="p-3!">
          <FieldContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                  <Zap className="w-4 h-4 fill-amber-500" />
                </div>
                <span className="font-semibold text-sm">Fast</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={selectedMode === "fast" ? "default" : "secondary"}
                >
                  1× credits
                </Badge>
                <RadioGroupItem value="fast" id="fast" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Quick & affordable. Detects pauses and generates accurate
              timestamped segments. Great for most audio, including English.
            </p>
          </FieldContent>
        </Field>
      </FieldLabel>

      <FieldLabel
        htmlFor="accuracy"
        className="has-[>[data-slot=field]]:rounded-xl"
      >
        <Field className="p-3!">
          <FieldContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                  <Target className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Accuracy</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedMode === "accuracy" ? "default" : "secondary"
                  }
                >
                  2× credits
                </Badge>
                <RadioGroupItem
                  className="bg-black"
                  value="accuracy"
                  id="accuracy"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Full accuracy with word-level timestamps and language detection.
              Best for interviews, lectures, and multilingual audio.
            </p>
          </FieldContent>
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
};

export default ModeSelection;
