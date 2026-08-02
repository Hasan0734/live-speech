import { Metadata } from "next";
import SpeechPlayground from "@/components/TextToSpeech/SpeechPlayground";

export const metadata: Metadata = {
  title: "Text to speech generate easy.",
  description: "Free text to speech generation made easy.",
};

const TextToSpeech = () => {
  return (
      <div className="relative h-screen flex px-4 md:px-0">
        <SpeechPlayground />
    </div>
  );
};

export default TextToSpeech;
