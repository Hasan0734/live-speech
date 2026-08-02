export type Transcript = {
  id?: string;
  text: string;
  role: "model" | "user";
  audioUrl?: string;
  isPlaying?: boolean
}


export type VoiceInfo =  {
  name: string;
  language?: string;
  gender?: string;
  style?: string;
  provider?: string;
}