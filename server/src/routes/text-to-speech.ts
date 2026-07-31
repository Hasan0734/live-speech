import type { FastifyInstance } from "fastify";
import { GoogleGenAI, Modality } from "@google/genai";

const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not set.")
    }

    return new GoogleGenAI({
        apiKey: apiKey || "",
        httpOptions: {
            headers: {
                "User-Agent": 'test-build'
            }
        }
    })
}

interface SpeechBody {
    text: string,
    voice: string
}

const createWavBuffer = (rawMimeType: string, base64Audio: string) => {
    let audioUrl = "";

    if (rawMimeType.includes("pcm") || (!rawMimeType.includes("wav") && !rawMimeType.includes("mp3"))) {

        const pcmBuffer = Buffer.from(base64Audio, "base64");
        const sampleRate = 24000;
        const numChannels = 1;
        const bitDepth = 16;
        const dataSize = pcmBuffer.length;
        const header = Buffer.alloc(44);

        header.write("RIFF", 0);
        header.writeUInt32LE(36 + dataSize, 4);
        header.write("WAVE", 8);
        header.write("fmt ", 12);
        header.writeUInt32LE(16, 16); // Subchunk1Size
        header.writeUInt16LE(1, 20);  // PCM format
        header.writeUInt16LE(numChannels, 22);
        header.writeUInt32LE(sampleRate, 24);
        header.writeUInt32LE(sampleRate * numChannels * (bitDepth / 8), 28);
        header.writeUInt16LE(numChannels * (bitDepth / 8), 32);
        header.writeUInt16LE(bitDepth, 34);
        header.write("data", 36);
        header.writeUInt32LE(dataSize, 40);

        const wavBuffer = Buffer.concat([header, pcmBuffer]);
        audioUrl = `data:audio/wav;base64,${wavBuffer.toString("base64")}`;
    } else {
        audioUrl = `data:${rawMimeType};base64,${base64Audio}`;
    }

    return audioUrl;
}

export async function TextToSpeech(app: FastifyInstance) {
    app.post<{ Body: SpeechBody }>("/text-to-speech", async (req, replay) => {

        const { text, voice = "Kore" } = req.body;
        if (!text || typeof text !== "string") {
            return replay.code(400).send({ error: "Valid text is requried for TTS." })
        }

        try {
            const ai = getAi()
            const response = await ai.models.generateContent({
                model: "gemini-3.1-flash-tts-preview",
                contents: [{ parts: [{ text: text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: voice }
                        }
                    }
                }

            });
            const candidatePart = response.candidates?.[0]?.content?.parts?.[0];
            const base64Audio = candidatePart?.inlineData?.data;
            const rawMimeType = candidatePart?.inlineData?.mimeType || "audion/pcm;rate=24000"
            if (!base64Audio) {
                return replay.code(500).send({ error: "No audio data received from Gemini TTS model." })
            }
            let audioUrl = createWavBuffer(rawMimeType, base64Audio);
            replay.code(200).send({ audioUrl, voiceUsed: voice, textLength: text.length });

        } catch (error: any) {
            console.error(error)
            app.log.info("Sever error", error.message)
        }

    })
}