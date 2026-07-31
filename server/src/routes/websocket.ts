import type { FastifyInstance } from "fastify";
import type { Socket } from "socket.io";
import { GoogleGenAI, LiveServerMessage, Modality, MediaResolution, Session, ThinkingLevel, TurnCoverage, ActivityHandling, StartSensitivity, EndSensitivity } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { ai } from '../lib/utils'

interface WavConversionOptions {
    numChannels: number,
    sampleRate: number,
    bitsPerSample: number
}
export async function websocketRoutes(app: FastifyInstance) {


    const model = 'models/gemini-3.1-flash-live-preview'

    const config = {
        responseModalities: [
            Modality.AUDIO,
        ],
        thinkingLevel: ThinkingLevel.LOW,
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
        speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: {
                    voiceName: 'Zephyr',
                }
            },

        },
        contextWindowCompression: {
            triggerTokens: '104857',
            slidingWindow: { targetTokens: '52428' },
        },

        // realtimeInputConfig: {
        //     automaticActivityDetection: {
        //         disabled: false,
        //         silenceDurationMs: 2000,
        //         prefixPaddingMs: 500,
        //         startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_UNSPECIFIED,
        //         endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_UNSPECIFIED,

        //     },
        //     activityHandling: ActivityHandling.ACTIVITY_HANDLING_UNSPECIFIED,
        //     turnCoverage: TurnCoverage.TURN_INCLUDES_ONLY_ACTIVITY
        // }
    };


    app.io.on("connection", async (socket: Socket) => {
        app.log.info('Client connected via WebSocket');

        let geminiSession: Session | null = null;
        let audioChunks: Buffer[] = [];


        async function stopAndClearStream() {
            if (geminiSession) {
                try {
                    geminiSession.close();
                } catch (e) {
                    console.error("Error closing session:", e);
                }
                geminiSession = null;
            }
            audioChunks = [];
            socket.emit("gemini:status", { message: "", type: "" });
        }

        async function ensureGeminiSession() {
            if (geminiSession) return geminiSession;
            socket.emit("gemini:status", { message: "Connecting to server...", type: "" });

            geminiSession = await ai.live.connect({
                model,
                callbacks: {
                    onopen: function () {
                        console.log("Opened")
                        socket.emit("gemini:status", { message: "Stream is live", type: "LIVE_STREAM" });
                    },
                    onmessage(message: LiveServerMessage) {
                        const inputText = message.serverContent?.inputTranscription?.text
                        if (inputText) {

                            socket.emit("gemini:input-text", {
                                id: uuidv4(),
                                text: inputText,
                                role: "user",
                            });
                        }
                        const parts = message.serverContent?.modelTurn?.parts ?? [];
                        for (const part of parts) {
                            if (part.inlineData?.data) {
                                // Extract sample rate (default 24000)
                                let sampleRate = 24000;
                                if (part.inlineData.mimeType) {
                                    const match = part.inlineData.mimeType.match(/rate=(\d+)/);
                                    if (match?.[1]) sampleRate = parseInt(match[1], 10);
                                }


                                // STREAM IMMEDIATELY: Do not wait for turnComplete
                                socket.emit("gemini:audioChunk", {
                                    id: uuidv4(),
                                    base64Pcm: part.inlineData.data, // Raw 16-bit PCM base64
                                    sampleRate,
                                });
                            }

                            // if (part.text) {
                            //     socket.emit("gemini:text", { text: part.text, role: "model" });
                            // }
                        }

                        const transcriptionText = message.serverContent?.outputTranscription?.text;
                        if (transcriptionText && parts.every(p => !p.text)) {
                            socket.emit("gemini:text", {
                                id: uuidv4(),
                                text: transcriptionText,
                                role: "model",
                            });
                        }

                        if (message.serverContent?.interrupted) {
                            console.log("user start to talking...")
                        }
                        if (message.serverContent?.turnComplete) {
                            socket.emit("gemini:turnComplete");
                        }

                    },
                    onerror: function (e: ErrorEvent) {
                        console.debug('Error:', e.message)
                        socket.emit("gemini:error", e.message);
                        stopAndClearStream();
                    },
                    onclose: function (e: CloseEvent) {
                        console.debug('Close:', e.reason);
                        socket.emit("gemini:status", { message: "Start new stream", type: "STOP_STREAM" });
                    }
                },
                config
            })
            return geminiSession;

        }
        socket.on("text:prompt", async (prompt) => {
            try {
                const session = await ensureGeminiSession();
                session.sendRealtimeInput({
                    text: prompt,
                });
            } catch (error) {
                console.error("Failed to send prompt:", error);
                socket.emit("gemini:status", { message: "Something wrong", type: "ERROR" });
            }
        })

        socket.on("audio:chunk", async (data: { mineType?: string; base64: string }) => {
            try {
                const session = await ensureGeminiSession();
                session.sendRealtimeInput({
                    audio: {
                        data: data.base64,
                        mimeType: data.mineType || "audio/pcm;rate=16000",
                    }
                })
            } catch (error) {
                console.error("Failed to send prompt:", error);
                socket.emit("gemini:status", { message: "Something wrong", type: "ERROR" });
            }
        })

        // socket.on("user:video", async (data) => {
        //     try {
        //         const session = await ensureGeminiSession();
        //         session.sendRealtimeInput({
        //             video: {

        //                 data: data.base64,
        //                 mimeType: data.mineType || "image/jpeg",
        //             }
        //         })
        //     } catch (error) {
        //         console.error("Failed to send prompt:", error);
        //         socket.emit("gemini:status", { message: "Something wrong", type: "ERROR" });
        //     }
        // })

        socket.on("stream:disconnect", async () => {
            console.log(`[Socket] User ${socket.id} requested stream disconnect.`);
            if (geminiSession) {
                await geminiSession.close();
            }
        })

        socket.on("stream:restart", async () => {
            console.log(`[Socket] Resetting stream for ${socket.id}...`);
            // socket.emit("gemini:status", { message: "Start new stream", type: "STOP_STREAM" });
            stopAndClearStream();
            await ensureGeminiSession();
        });

        socket.on("stream:new-chat", async () => {
            console.log(`[Socket] Resetting stream for ${socket.id}...`);
            await stopAndClearStream();

        });

        // ---------------- Disconnect ----------------
        socket.on("disconnect", () => {
            stopAndClearStream();
            app.log.info(`[Socket] ${socket.id} disconnected`);
        });

    })

}