export type Transcript = {
  id?: string;
  text: string;
  role: "model" | "user";
  audioUrl?: string;
  isPlaying?: boolean
}


export type VoiceInfo = {
  name: string;
  language?: string;
  gender?: string;
  style?: string;
  provider?: string;
}


export interface Project {
  id: string;
  hash: string;
  name: string;
  user_id: string;
  r2_folder: string;
  updated_at: Date;
  creaged_at: Date;
  
}