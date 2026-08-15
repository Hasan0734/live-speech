import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Play, RotateCcw, Undo2 } from "lucide-react";
import { formatDistance } from "date-fns";
import { VoiceGeneration } from "@/lib/type";
import { Badge } from "../ui/badge";

interface HistoryDetailsProps {
  setOpenDetails: Dispatch<SetStateAction<boolean>>;
  item: VoiceGeneration;
}

const HistoryDetails = ({ setOpenDetails, item }: HistoryDetailsProps) => {
  return (
    <div className="h-full flex flex-col p-2">
      <div className="flex items-center gap-2 text-sm">
        <Button
          size={"icon"}
          variant={"secondary"}
          onClick={() => setOpenDetails(false)}
        >
          <Undo2 />
        </Button>
        Back to history
      </div>

      <div className="flex items-center gap-2  mt-3">
        <div className="size-10 rounded-full bg-linear-to-tr from-indigo-500 to-pink-500 shrink-0" />
        <div className="flex flex-col">
          <span className="truncate max-w-42.5 text-base font-semibold">
            {item.voice_used}
          </span>
          <span className="shrink-0 text-sm text-muted-foreground">
            {formatDistance(item.created_at, new Date(), { addSuffix: true })}
          </span>
        </div>
      </div>
      <div className="my-3">
        <Badge variant={"secondary"}>170 credits used</Badge>
      </div>
      <div className="">
        <p className="text-sm text-muted-foreground  max-h-40 overflow-y-scroll scroll-fade scrollbar-thin scrollbar-thumb-gray-500">
          {item.text_content}
          {item.text_content}
          {item.text_content}
          {item.text_content}
          {item.text_content}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button size={'lg'} className="grow ">
            <Play /> Play
          </Button>
          <Button size={'lg'} className="grow">
            <RotateCcw />
            Restore text
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetails;
