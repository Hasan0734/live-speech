import { NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import { createClient } from "@/utils/supabase/server";
import { Upload } from '@aws-sdk/lib-storage';
import { s3 } from "@/utils/supabase/s3";



const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not set.");
    }

    return new GoogleGenAI({
        apiKey: apiKey || "",
        httpOptions: {
            headers: {
                "User-Agent": "nextjs-build"
            }
        }
    });
};

const createWavBuffer = (rawMimeType: string, base64Audio: string): Buffer => {
    const pcmBuffer = Buffer.from(base64Audio, "base64");

    if (rawMimeType.includes("pcm") || (!rawMimeType.includes("wav") && !rawMimeType.includes("mp3"))) {
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

        return Buffer.concat([header, pcmBuffer]);
    }

    return pcmBuffer;
};

export async function POST(req: Request) {
    const supabase = await createClient()
    try {
        const body = await req.json();
        const { text, voice = "Kore" } = body;

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "Valid text is required for TTS." },
                { status: 400 }
            );
        }

        const ai = getAi();
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
        const rawMimeType = candidatePart?.inlineData?.mimeType || "audio/pcm;rate=24000";

        if (!base64Audio) {
            return NextResponse.json(
                { error: "No audio data received from Gemini TTS model." },
                { status: 404 }
            );
        }

        // 1. Generate Buffer
        const audioBuffer = createWavBuffer(rawMimeType, base64Audio);
        const fileName = `tts-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.wav`;
        const filePath = `audio/${fileName}`;

        const parallelUpload = new Upload({
            client: s3,
            params: {
                Bucket: 'tts-audio',
                Key: filePath,
                Body: audioBuffer,
                ContentType: "audio/wav",
            },
            queueSize: 4,
            partSize: 5 * 1024 * 1024,
        });

        await parallelUpload.done();

        const { data } = supabase.storage
            .from('tts-audio')
            .getPublicUrl(filePath)
        const publicUrl = data.publicUrl;


        const { error: dbError } = await supabase.from("tts_logs")
            .insert([
                {
                    text_content: text,
                    voice_used: voice,
                    text_length: text.length,
                    file_path: filePath,
                    public_url: publicUrl
                }
            ])


        if (dbError) {
            console.error("Supabase database insert error:", dbError);
        }

        // 5. Respond back to client
        return NextResponse.json({
            success: true,
            audioUrl: publicUrl,
            voiceUsed: voice,
            textLength: text.length,
            filePath: filePath
        }, { status: 200 });


    } catch (error: any) {
        // console.error("TTS Route Error:", error);

        if (error.status == 429) {
            return NextResponse.json(
                { message: "You have to reched your limit." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}