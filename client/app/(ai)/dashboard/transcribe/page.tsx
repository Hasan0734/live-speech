import AudioTranscription from "@/components/Transcribe/AudioTranscription";
import { createClient } from "@/utils/supabase/server";

const getHistory = async () => {
  const supabase = await createClient();
  const res = await supabase.from("transcribe").select("*");

  return res?.data || [];
};

const TranscribePage = async () => {
  const data = await getHistory();
  return (
    <div className="relative flex px-4 md:px-0">
      <AudioTranscription initialHistory={data} />
    </div>
  );
};

export default TranscribePage;
