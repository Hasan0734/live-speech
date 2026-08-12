import { Metadata } from "next";
import SpeechPlayground from "@/components/TextToSpeech/SpeechPlayground";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Text to speech generate easy.",
  description: "Free text to speech generation made easy.",
};

const getHistory = async () => {
  const supabase = createClient();
  const res = (await supabase).from("tts-logs").select("*");
  return (await res)?.data || [];
};

const TextToSpeech = async () => {
  const data = await getHistory();

  console.log(data)
  return (
    <div className="relative h-screen flex px-4 md:px-0">
      <SpeechPlayground />
    </div>
  );
};

export default TextToSpeech;
