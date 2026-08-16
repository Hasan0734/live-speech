import React from "react";
import { Button } from "../ui/button";

interface TranscribeHeadingProps {
}

const TranscribeHeading = ({
}: TranscribeHeadingProps) => {
  return (
    <div className="flex items-start justify-between gap-3">
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
    </div>
  );
};

export default TranscribeHeading;
