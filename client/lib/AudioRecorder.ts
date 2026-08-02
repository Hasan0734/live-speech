// lib/AudioRecorder.ts

export type OnAudioChunkCallback = (base64Pcm: string) => void;
export type OnSilenceCallback = () => void;

export class AudioRecorder {
  private mediaStream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private onAudioChunk: OnAudioChunkCallback;
  private onSilenceDetected?: OnSilenceCallback;

  private isRecording: boolean = false;
  private hasSpoken: boolean = false; // Tracks if user has actually started speaking
  private silenceTimer: NodeJS.Timeout | null = null;

  // Adjusted VAD Configuration
  private silenceThreshold: number = 0.015; // Noise threshold
  private silenceDelayMs: number = 2500;    // Increased to 2.5 seconds so it doesn't stop too quickly

  constructor(
    onAudioChunk: OnAudioChunkCallback,
    onSilenceDetected?: OnSilenceCallback
  ) {
    this.onAudioChunk = onAudioChunk;
    this.onSilenceDetected = onSilenceDetected;
  }

  public async initMic(): Promise<void> {
    if (this.mediaStream) return;

    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioCtx({ sampleRate: 16000 });

    const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
    this.processor = this.audioCtx.createScriptProcessor(2048, 1, 1);

    this.processor.onaudioprocess = (e) => {
      if (!this.isRecording) return;

      const inputData = e.inputBuffer.getChannelData(0);

      // Measure volume (RMS)
      let sumSquares = 0;
      for (let i = 0; i < inputData.length; i++) {
        sumSquares += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sumSquares / inputData.length);

      // Check if user is actively speaking
      if (rms > this.silenceThreshold) {
        this.hasSpoken = true; // Mark that user speech has started

        // Clear silence countdown while user is talking
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      } else if (this.hasSpoken) {
        // Only trigger auto-silence AFTER the user has started speaking
        if (!this.silenceTimer) {
          this.silenceTimer = setTimeout(() => {
            this.stopRecording();
            if (this.onSilenceDetected) {
              this.onSilenceDetected();
            }
          }, this.silenceDelayMs);
        }
      }

      // Convert Float32Array to 16-bit PCM Int16Array
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      // Encode bytes to Base64
      const bytes = new Uint8Array(pcm16.buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      this.onAudioChunk(btoa(binary));
    };

    source.connect(this.processor);
    this.processor.connect(this.audioCtx.destination);
  }

  // Resets state so new speech turns work every time
  public startRecording(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    this.hasSpoken = false; // Reset speech flag
    this.isRecording = true;
  }

  public stopRecording(): void {
    this.isRecording = false;
    this.hasSpoken = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  public close(): void {
    this.stopRecording();
    this.processor?.disconnect();
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.audioCtx?.close();
  }
}