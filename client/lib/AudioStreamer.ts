// lib/AudioStreamer.ts
export class AudioStreamer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime: number = 0;
  private activeSourcesCount: number = 0;

  public onPlaybackStart?: () => void;
  public onPlaybackEnd?: () => void;

  private initContext(sampleRate: number) {
    if (!this.audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx({ sampleRate });
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  public playChunk(base64Pcm: string, sampleRate: number = 24000) {
    this.initContext(sampleRate);
    if (!this.audioCtx) return;

    // Convert Base64 PCM 16-bit to Float32
    const binary = atob(base64Pcm);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);

    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768;
    }

    const buffer = this.audioCtx.createBuffer(1, float32.length, sampleRate);
    buffer.getChannelData(0).set(float32);

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);

    const currentTime = this.audioCtx.currentTime;
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime;
    }

    // Trigger onPlaybackStart when the first chunk starts playing
    if (this.activeSourcesCount === 0 && this.onPlaybackStart) {
      this.onPlaybackStart();
    }

    this.activeSourcesCount++;

    source.onended = () => {
      this.activeSourcesCount--;
      // Trigger onPlaybackEnd when all queued audio chunks have finished playing
      if (this.activeSourcesCount === 0 && this.onPlaybackEnd) {
        this.onPlaybackEnd();
      }
    };

    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
  }

  public stop() {
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.nextStartTime = 0;
    this.activeSourcesCount = 0;
    if (this.onPlaybackEnd) {
      this.onPlaybackEnd();
    }
  }
}