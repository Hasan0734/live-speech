import { Metadata } from "next";
import SpeechPlayground from "@/components/TextToSpeech/SpeechPlayground";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Text to speech generate easy.",
  description: "Free text to speech generation made easy.",
};

const getHistory = async () => {
  const supabase = await createClient();
  const res = await supabase.from("tts_logs").select("*");

  return res?.data || [];
};

const TextToSpeech = async () => {
  const data = await getHistory();

  return (
    <div className="relative min-h-[calc(100vh-59px)]">
      <SpeechPlayground initialHistory={data} />
    </div>
  );
};

export default TextToSpeech;
