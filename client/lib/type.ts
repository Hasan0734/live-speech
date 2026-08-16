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
  updated_at: string;
  creaged_at: string;

}

export type VoiceGeneration = {
  id: string,
  text_content: string
  voice_used: string
  text_length: number
  file_path: string
  public_url: string
  user_id?: string
  created_at: string
  updated_at: string
}

export type Transcribe = {
  id: string
  text_content: string;
  text_length: string;
  language: string;
  file_path: string;
  public_url: string;
  user_id: string;
  mode: "fast" | "accuracy";
  duration: number;
  credit_used: number;
  file_name: number;
  created_at: string;
  update_at: string

}