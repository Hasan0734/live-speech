import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface VoiceAvatarProps {
  isPlaying: boolean;
  isGenerating: boolean;
  large?: boolean;
}

const VoiceAvatar: React.FC<VoiceAvatarProps> = ({
  isPlaying,
  isGenerating,
  large = false,
}) => {
  const bars = [35, 55, 75, 45, 65];

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl border bg-linear-to-br from-primary/10 via-primary/5 to-background ${
        large ? "size-14" : "size-11"
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {isGenerating ? (
          <Sparkles className="size-5 animate-pulse text-primary" />
        ) : (
          <div className="flex h-7 items-center gap-0.5">
            {bars.map((height, index) => (
              <motion.span
                key={index}
                animate={
                  isPlaying
                    ? {
                        height: [
                          `${height}%`,
                          `${Math.min(height + 25, 95)}%`,
                          `${Math.max(height - 15, 20)}%`,
                          `${height}%`,
                        ],
                      }
                    : {
                        height: `${height}%`,
                      }
                }
                transition={{
                  duration: 0.7,
                  repeat: isPlaying ? Infinity : 0,
                  delay: index * 0.08,
                  ease: "easeInOut",
                }}
                className="w-1 rounded-full bg-primary"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAvatar;
