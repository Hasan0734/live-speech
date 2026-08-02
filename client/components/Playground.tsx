"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import InitialSection from "./InitialSection";
import ChatForm from "./ChatForm";
import VideoPreview from "./VideoPreview";
import GeminiStatus from "./GeminiStatus";
import ChatHistory from "./ChatHistory";
import { socket } from "@/lib/socket";
import { Transcript, VoiceInfo } from "@/lib/type";
import { AudioStreamer } from "@/lib/AudioStreamer";
import { pcmToWavDataUri } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

const Playground = () => {
  // Connection & Activity States
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Status & Transcripts
  const [statusType, setStatusType] = useState<string>("IDLE");
  const [geminiMessage, setGeminiMessage] = useState<string>("");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<Transcript | null>(
    null,
  );

  // Hardware Stream Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Store references to clean them up later
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Native Audio Element Reference

  const streamerRef = useRef<AudioStreamer | null>(null);
  const pcmBufferRef = useRef<Uint8Array[]>([]);
  const currentTranscriptRef = useRef<Transcript | null>(null);

  const [selectedVoice, setSelectedVoice] = useState<VoiceInfo>({
    name: "Zephyr",
    language: "English (US)",
    gender: "Neutral",
    style: "Natural",
    provider: "Gemini",
  });

  useEffect(() => {
    currentTranscriptRef.current = currentTranscript;
  }, [currentTranscript]);

  useEffect(() => {
    // 1. Initialize Web Audio API streamer
    const streamer = new AudioStreamer();
    streamer.onPlaybackStart = () => {
      setCurrentTranscript((prev) => {
        if (!prev) {
          return {
            id: uuidv4(),
            role: "model",
            text: "",
            isPlaying: true,
          };
        }
        return { ...prev, isPlaying: true };
      });
    };
    streamer.onPlaybackEnd = () => {};
    streamerRef.current = streamer;

    // 2. Real-time Audio Chunk Handler
    const onGeminiAudioChunk = (data: {
      base64Pcm: string;
      sampleRate: number;
      id: string;
    }) => {
      // console.log("received the audio chunk");
      streamerRef.current?.playChunk(data.base64Pcm, data.sampleRate);
      const binary = atob(data.base64Pcm);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      pcmBufferRef.current.push(bytes);
      setCurrentTranscript((prev) => {
        if (!prev) {
          return {
            id: data.id,
            role: "model",
            text: "",
            isPlaying: true,
          };
        }
        return prev;
      });
    };

    // 3. Real-time Text Streaming Handler
    const onGeminiText = (data: {
      text: string;
      role: "model" | "user";
      id: string;
    }) => {
      setCurrentTranscript((prev) => {
        if (!prev) {
          return {
            id: data.id,
            role: "model",
            text: data.text,
            isPlaying: true,
          };
        }
        return { ...prev, text: prev.text + data.text };
      });
    };

    // 4. Turn Complete Handler
    const onGeminiTurnComplete = () => {
      let finalAudioUrl: string | undefined = undefined;

      if (pcmBufferRef.current.length > 0) {
        const totalLength = pcmBufferRef.current.reduce(
          (acc, curr) => acc + curr.length,
          0,
        );
        const mergedPcm = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of pcmBufferRef.current) {
          mergedPcm.set(chunk, offset);
          offset += chunk.length;
        }

        finalAudioUrl = pcmToWavDataUri(mergedPcm, 24000);
        pcmBufferRef.current = [];
      }

      const activeTurn = currentTranscriptRef.current;
      if (activeTurn) {
        const turnWithAudio: Transcript = {
          ...activeTurn,
          audioUrl: finalAudioUrl,
          isPlaying: false,
        };
        setTranscripts((prev) => [...prev, turnWithAudio]);
        setCurrentTranscript(null);
      }
    };

    socket.on("gemini:audioChunk", onGeminiAudioChunk);
    socket.on("gemini:text", onGeminiText);
    socket.on("gemini:turnComplete", onGeminiTurnComplete);

    socket.on("gemini:input-text", (data) => {
      setTranscripts((prev) => [
        ...prev,
        {
          ...data,
          isPlaying: false,
        },
      ]);
    });

    return () => {
      socket.off("gemini:audioChunk", onGeminiAudioChunk);
      socket.off("gemini:text", onGeminiText);
      socket.off("gemini:turnComplete", onGeminiTurnComplete);
      socket.on("gemini:input-text", () => {});
      streamerRef.current?.stop();
    };
  }, []);

  // Sync ref with state
  useEffect(() => {
    currentTranscriptRef.current = currentTranscript;
  }, [currentTranscript]);

  // Handle Hardware Permission Changes (Browser API)
  useEffect(() => {
    let micStatus: PermissionStatus | null = null;
    let cameraStatus: PermissionStatus | null = null;

    const listenToPermissions = async () => {
      try {
        micStatus = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        micStatus.onchange = () => {
          if (micStatus?.state === "denied") {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            toast.error("Microphone permission was revoked.");
          }
        };

        cameraStatus = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        cameraStatus.onchange = () => {
          if (cameraStatus?.state === "denied") {
            stopCamera();
            toast.error("Camera permission was revoked.");
          }
        };
      } catch (e) {
        console.warn(
          "Permissions API query not fully supported in this browser.",
          e,
        );
      }
    };

    listenToPermissions();

    return () => {
      if (micStatus) micStatus.onchange = null;
      if (cameraStatus) cameraStatus.onchange = null;
    };
  }, []);

  // Socket Connection Lifecycle & Socket Listeners
  useEffect(() => {
    if (socket.connected) {
      setIsConnected(true);
    }

    const onConnect = () => {
      console.log("[Socket] Connected:", socket.id);
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("[Socket] Disconnected");
      setIsConnected(false);
    };

    // 3. Status Updates ("CONNECTING", "LIVE_STREAMING", "IDLE", "ERROR")
    const onGeminiStatus = ({
      message,
      type,
    }: {
      message: string;
      type: string;
    }) => {
      setGeminiMessage(message);
      setStatusType(type);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("gemini:status", onGeminiStatus);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("gemini:status", onGeminiStatus);
    };
  }, []);

  // --- HARDWARE CONTROLLERS ---

  // Microphone Audio Streamer
  const toggleRecording = async () => {
    // 1. Unmute/Mute if Camera is actively sharing mic
    if (isCameraActive && cameraStreamRef.current) {
      const audioTracks = cameraStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextState = !audioTracks[0].enabled;
        audioTracks.forEach((track) => (track.enabled = nextState));
        setIsRecording(nextState);

        return;
      }
    }

    // 2. Unmute/Mute if Screen share is actively sharing mic
    if (isScreenSharing && screenStreamRef.current) {
      const audioTracks = screenStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextState = !audioTracks[0].enabled;
        audioTracks.forEach((track) => (track.enabled = nextState));
        setIsRecording(nextState);
        return;
      }
    }

    // 3. Stop Mic Recording if currently active
    if (isRecording) {
      if (workletNodeRef.current) {
        workletNodeRef.current.disconnect();
        workletNodeRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      setIsRecording(false);
      return;
    }

    // 4. Start Mic Recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      // Gemini requires 16000Hz (or 24000Hz)
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      await audioContext.audioWorklet.addModule("/pcm-processor.js");

      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, "pcm-processor");
      workletNodeRef.current = workletNode;

      workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
        const pcmFloat32Data = event.data;

        // A. Convert Float32Array (Web Audio) to Int16Array (Standard PCM)
        const int16Data = new Int16Array(pcmFloat32Data.length);
        for (let i = 0; i < pcmFloat32Data.length; i++) {
          // Clamp values between -1.0 and 1.0, then scale to 16-bit range
          const s = Math.max(-1, Math.min(1, pcmFloat32Data[i]));
          int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // B. Convert Int16Array to Base64 string
        let binary = "";
        const bytes = new Uint8Array(int16Data.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Data = window.btoa(binary);

        // C. Emit to backend via Socket.IO
        if (socket.connected) {
          socket.emit("audio:chunk", {
            base64: base64Data,
            mimeType: "audio/pcm;rate=16000",
            voice: selectedVoice.name,
          });
        }
      };

      source.connect(workletNode);
      setIsRecording(true);

      // recorder.ondataavailable = async (e) => {
      //   if (e.data.size > 0 && socket.connected) {
      //     const reader = new FileReader();
      //     reader.onloadend = () => {
      //       const base64data = (reader.result as string).split(",")[1];
      //       socket.emit("audio:chunk", {
      //         base64: base64data,
      //         mimeType: "audio/pcm;rate=16000",
      //       });
      //     };
      //     reader.readAsDataURL(e.data);
      //   }
      // };

      // recorder.start(250); // Send 250ms audio slices to backend
      // mediaRecorderRef.current = recorder;
      // setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied.");
      console.error("Mic error:", err);
    }
  };

  // Helper Stop Camera
  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoIntervalRef.current) {
      clearInterval(videoIntervalRef.current);
      videoIntervalRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Camera Toggle & Video Frame Streaming
  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera();
      return;
    }

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      const combinedStream = new MediaStream(videoStream.getVideoTracks());

      // try {
      //   // captureFrame(combinedStream);
      //   // const audioStream = await navigator.mediaDevices.getUserMedia({
      //   //   audio: true,
      //   // });
      //   // audioStream
      //   //   .getAudioTracks()
      //   //   .forEach((track) => combinedStream.addTrack(track));
      //   toggleRecording();
      //   // setIsRecording(true);
      // } catch {
      //   toast.warning(
      //     "Microphone access denied. Webcam running in video-only mode.",
      //   );
      //   setIsRecording(false);
      // }

      toggleRecording();

      cameraStreamRef.current = combinedStream;
      setIsCameraActive(true);
    } catch (err) {
      toast.error("Webcam access denied.");
      console.error("Camera error:", err);
    }
  };
  // Screen Sharing Toggle
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
      setIsRecording(false);
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const combinedStream = new MediaStream(screenStream.getVideoTracks());

      screenStream.getVideoTracks()[0].onended = () => {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach((t) => t.stop());
          screenStreamRef.current = null;
        }
        setIsScreenSharing(false);
        setIsRecording(false);
      };

      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioStream
          .getAudioTracks()
          .forEach((track) => combinedStream.addTrack(track));
        setIsRecording(true);
      } catch {
        toast.warning("Microphone access denied. Sharing screen without mic.");
        setIsRecording(false);
      }

      screenStreamRef.current = combinedStream;
      setIsScreenSharing(true);
    } catch (err) {
      toast.error("Screen sharing permission denied.");
      console.error("Screen share error:", err);
    }
  };

  // Active Transcripts Payload (Combines finished turns + current in-progress turn)
  const displayTranscripts = currentTranscript
    ? [...transcripts, currentTranscript]
    : transcripts;

  return (
    <div className="h-screen max-w-3xl mx-auto flex flex-col justify-between relative px-4">
      {/* Upper Area: Chat History / Welcome Screen */}
      <div className="flex-1 py-5 overflow-y-auto">
        {displayTranscripts.length > 0 && (
          <ChatHistory transcripts={displayTranscripts} />
        )}
        {!geminiMessage && (
          <div className="h-full flex justify-center items-center">
            <InitialSection
              toggleCamera={toggleCamera}
              toggleRecording={toggleRecording}
              toggleScreenShare={toggleScreenShare}
            />
          </div>
        )}
      </div>

      {/* Lower Area: Status Bar & Controls */}
      <div className="pb-4 space-y-3">
        <GeminiStatus
          selectedVoice={selectedVoice}
          geminiMessage={geminiMessage}
          statusType={statusType}
          isConnected={isConnected}
          socket={socket}
          setTranscripts={setTranscripts}
        />

        <ChatForm
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          toggleCamera={toggleCamera}
          isRecording={isRecording}
          isCameraActive={isCameraActive}
          isScreenSharing={isScreenSharing}
          toggleRecording={toggleRecording}
          toggleScreenShare={toggleScreenShare}
          socket={socket}
          setTranscripts={setTranscripts}
        />
      </div>

      {/* Video Previews */}
      {isCameraActive && cameraStreamRef.current && (
        <VideoPreview
          socket={socket}
          isCameraActive={isCameraActive}
          cameraStream={cameraStreamRef.current}
        />
      )}

      {isScreenSharing && screenStreamRef.current && (
        <VideoPreview
          socket={socket}
          isCameraActive={isScreenSharing}
          cameraStream={screenStreamRef.current}
        />
      )}
    </div>
  );
};

export default Playground;
