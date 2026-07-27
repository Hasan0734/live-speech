import type { FastifyInstance } from "fastify";
import type { Socket } from "socket.io";
import { GoogleGenAI, LiveServerMessage, Modality, MediaResolution, Session } from '@google/genai';
import { writeFile } from 'fs';


const responseQueue: LiveServerMessage[] = [];

interface WavConversionOptions {
    numChannels: number,
    sampleRate: number,
    bitsPerSample: number
}




let audioChunks: Buffer[] = [];
let detectedSampleRate = 24000;
const audioParts: string[] = [];




function createWavHeader(dataLength: number, options: WavConversionOptions) {
    const {
        numChannels,
        sampleRate,
        bitsPerSample,
    } = options;

    // http://soundfile.sapp.org/doc/WaveFormat

    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const buffer = Buffer.alloc(44);

    buffer.write('RIFF', 0);                      // ChunkID
    buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
    buffer.write('WAVE', 8);                      // Format
    buffer.write('fmt ', 12);                     // Subchunk1ID
    buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
    buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
    buffer.writeUInt16LE(numChannels, 22);        // NumChannels
    buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
    buffer.writeUInt32LE(byteRate, 28);           // ByteRate
    buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
    buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSample
    buffer.write('data', 36);                     // Subchunk2ID
    buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

    return buffer;
}

export async function websocketRoutes(app: FastifyInstance) {

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });


    const model = 'models/gemini-3.1-flash-live-preview'

    const config = {
        responseModalities: [
            Modality.AUDIO,
        ],
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
        speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: {
                    voiceName: 'Zephyr',
                }
            }
        },
        contextWindowCompression: {
            triggerTokens: '104857',
            slidingWindow: { targetTokens: '52428' },
        },
    };


    app.io.on("connection", async (socket: Socket) => {
        app.log.info('Client connected via WebSocket');

        let geminiSession: Session | null = null;
        let audioChunks: Buffer[] = [];
        let detectedSampleRate = 24000;


        async function stopAndClearStream() {
            if (geminiSession) {
                try {
                    await geminiSession.close();
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
                                text: transcriptionText,
                                role: "model",
                            });
                        }

                        if (message.serverContent?.turnComplete) {
                            socket.emit("gemini:turnComplete");
                        }

                        // for (const part of parts) {
                        //     // Collect PCM raw byte buffers
                        //     if (part.inlineData?.data) {
                        //         const buffer = Buffer.from(part.inlineData.data, "base64");
                        //         audioChunks.push(buffer);

                        //         // Dynamically extract sample rate from mimeType if present
                        //         if (part.inlineData.mimeType) {
                        //             const match = part.inlineData.mimeType.match(/rate=(\d+)/);
                        //             if (match && match[1]) {
                        //                 detectedSampleRate = parseInt(match[1], 10);
                        //             }
                        //         }
                        //     }
                        //     // 2. Stream inline model text chunks in real-time
                        //     if (part.text) {
                        //         socket.emit("gemini:text", {
                        //             text: part.text,
                        //             role: "model",
                        //         });
                        //     }
                        // }
                        // const transcriptionText = message.serverContent?.outputTranscription?.text;
                        // if (transcriptionText && parts.every(p => !p.text)) {
                        //     socket.emit("gemini:text", {
                        //         text: transcriptionText,
                        //         role: "model",
                        //     });
                        // }

                        // // Turn complete -> Build complete WAV & send as Data URI
                        // if (message.serverContent?.turnComplete) {
                        //     if (audioChunks.length > 0) {
                        //         const pcm = Buffer.concat(audioChunks);

                        //         const wavHeader = createWavHeader(pcm.length, {
                        //             numChannels: 1,
                        //             sampleRate: detectedSampleRate,
                        //             bitsPerSample: 16,
                        //         });

                        //         const fullWav = Buffer.concat([wavHeader, pcm]);

                        //         // Send full base64 data URI directly to frontend player
                        //         socket.emit("gemini:audio", {
                        //             src: `data:audio/wav;base64,${fullWav.toString("base64")}`,
                        //         });

                        //         // Clear array for the next turn
                        //         audioChunks = [];
                        //     }

                        //     socket.emit("gemini:turnComplete");
                        //     // socket.emit("gemini:status", "IDLE");
                        // }
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

            // geminiSession.sendClientContent({
            //     turns: [
            //         `INSERT_INPUT_HERE`
            //     ]
            // });
            // await handleTurn()
            // geminiSession.close()

        }


        socket.on("text:prompt", async (prompt) => {
            console.log({prompt})

            try {
                const session = await ensureGeminiSession();
                await session.sendClientContent({
                    turns: [{ role: "user", parts: [{ text: prompt }] }],
                });
            } catch (error) {
                console.error("Failed to send prompt:", error);
                socket.emit("gemini:status", { message: "Something wrong", type: "ERROR" });
            }

        })


        socket.on("audio:chunk", async (data: { mineType?: string; base64: string }) => {
            const session = await ensureGeminiSession();

            session.sendRealtimeInput({
                audio: {
                    data: data.base64,
                    mimeType: data.mineType || "audio/pcm;rate=16000",
                }
            })
        })

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