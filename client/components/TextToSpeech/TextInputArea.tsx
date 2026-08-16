import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { AnimatePresence, motion } from "motion/react";
import ChooseVoice from "../ChooseVoice";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { VoiceInfo } from "@/lib/type";

interface TextInputAreaProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  loading: boolean;
  handleGenerate: () => void;
  selectedVoice: VoiceInfo;
  setSelectedVoice: Dispatch<SetStateAction<VoiceInfo>>;
}

const TextInputArea = ({
  text,
  setText,
  loading,
  handleGenerate,
  selectedVoice,
  setSelectedVoice,
}: TextInputAreaProps) => {
  return (
    <InputGroup className="min-h-0 bg-background!  px-0 dark:has-disabled:bg-input/30 pt-2 has-disabled:opacity-100 flex-1 rounded-none has-data-[slot=input-group-control]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
      <InputGroupTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start type here or paste..."
        className=" h-full pt-5 sm:px-10 2xl:px-30 scroll-fade scrollbar-thin scrollbar-thumb-accent text-sm text-balance"
      />
      <InputGroupAddon
        align={"block-end"}
        className="flex flex-col px-4 2xl:px-0 pb-5"
      >
        <AnimatePresence>
          {text && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{
                duration: 0.4,
              }}
              className="flex items-center justify-between w-full px-2"
            >
              <div>
                <ChooseVoice
                  selectedVoice={selectedVoice}
                  setSelectedVoice={setSelectedVoice}
                />
              </div>
              <div className="flex justify-end gap-3 items-center">
                <span className="text-muted-foreground text-sm">
                  {text.length}/ 5000
                </span>
                <Button
                  size={"lg"}
                  disabled={loading}
                  onClick={handleGenerate}
                  variant={"secondary"}
                >
                  {loading ? (
                    <>
                      <Spinner /> Generating...
                    </>
                  ) : (
                    "Generate speech"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default TextInputArea;
