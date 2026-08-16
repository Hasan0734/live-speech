import { s3 } from "@/utils/supabase/s3";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { GetObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs'
import { pipeline } from "stream/promises";
import { getAi } from "@/lib/utils";



const getSystemInstruction = (language?: string) => {
    const languageRule = language
        ? `THE AUDIO IS SPOKEN IN THE FOLLOWING LANGUAGE: ${language}. You must transcribe the text strictly in this language. Do not translate it.`
        : `AUTOMATICALLY DETECT THE SPOKEN LANGUAGE. Transcribe the audio in its native detected language. Do not translate it to English unless the audio itself is in English.`;

    return `You are a precise audio transcription tool. Your task is to transcribe the provided audio text word-for-word.

${languageRule}

CRITICAL OUTPUT FORMATTING RULES:
1. Every line MUST begin with a timestamp indicating when the sentence started.
2. Format the timestamp exactly as [M:SS] or [MM:SS] depending on length (e.g., 0:01, 2:14, 11:05). Do not use milliseconds.
3. Follow the timestamp immediately with the verbatim text spoken.
4. Do not wrap the output in markdown blockquotes or summary text blocks. Return raw string segments.

EXAMPLE OUTPUT FORMAT:
0:01 hello world
0:04 thank you for joining this conversation today
0:09 we will be discussing the new updates`;
};

export async function POST(req: Request) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
        return NextResponse.json({ message: "Authentication required." }, { status: 401, statusText: "Authentication required." })
    }

    const body = await req.json();
    const { key, mimetype, mode, language, duration, filename } = body as {
        key: string;
        mimetype: string;
        mode?: "fast" | "accuracy";
        language: string;
        filename: string;
        duration: number
    };

    if (!key || !mimetype) {
        return NextResponse.json({ error: "Missing required key or mimetype parameters." }, { status: 400, statusText: "Key or Mimetype missing" });
    }


    let tempFilePath = "";
    let geminiFileRef: any = null;
    const ai = getAi();


    try {
        const s3Response = await s3.send(new GetObjectCommand({
            Bucket: 'uploads-audio',
            Key: key
        }));

        if (!s3Response.Body) {
            return NextResponse.json({ error: "Audio file not found in S3 storage." }, { status: 404 });
        }


        const { data } = supabase.storage
            .from('uploads-audio')
            .getPublicUrl(key)
        const publicUrl = data.publicUrl;

        tempFilePath = path.join(process.cwd(), `temp_${key}`);
        await pipeline(s3Response.Body as any, fs.createWriteStream(tempFilePath));

        geminiFileRef = await ai.files.upload({
            file: tempFilePath,
            config: {
                mimeType: mimetype || "audio/mpeg"
            }
        });

        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                let fullTranscriptionText = "";
                try {
                    const responseStream = await ai.interactions.create({
                        model: 'gemini-2.5-flash',
                        input: [
                            { type: "text", text: "Please generate the timestamped transcript for this audio following your formatting rules" },
                            {
                                type: "audio",
                                uri: geminiFileRef.uri,
                                mime_type: geminiFileRef.mimeType
                            }
                        ],

                        system_instruction: getSystemInstruction(language),
                        stream: true
                    });


                    for await (const event of responseStream) {
                        if (event.event_type === "step.delta") {
                            if (event.delta.type === "text") {
                                const textChunk = event.delta.text;
                                fullTranscriptionText += textChunk;

                                const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n\n`;
                                controller.enqueue(encoder.encode(chunk));
                            }
                        }
                    }



                    if (fullTranscriptionText.trim()) {
                        const { error: dbError } = await supabase.from("transcribe").insert([
                            {
                                file_path: key,
                                public_url: publicUrl,
                                text_content: fullTranscriptionText,
                                language: language || "auto-detected",
                                text_length: fullTranscriptionText.length,
                                user_id: user.id,
                                duration,
                                filename,
                                mode,
                            },
                        ]);

                        if (dbError) {
                            console.error("Supabase database insert error:", dbError);
                        }
                    }

                    controller.enqueue(encoder.encode(`data: [DONE]\n\n\n`));
                    controller.close();
                } catch (streamError: any) {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ error: streamError.message })}\n\n`)
                    );
                    controller.close();
                } finally {
                    if (tempFilePath && fs.existsSync(tempFilePath)) {
                        try {
                            fs.unlinkSync(tempFilePath);
                        } catch { }
                    }
                    if (geminiFileRef?.name) {
                        await ai.files.delete({ name: geminiFileRef.name }).catch(() => null);
                    }
                }
            }
        })

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        })


    } catch (error: any) {

        if (error.status == 429) {
            return NextResponse.json(
                { message: "You have to reached your limit." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 }
        );
    } finally {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath)
            } catch (error) { }
        }
        if (geminiFileRef?.name) {
            await ai.files.delete({ name: geminiFileRef.name }).catch(() => null);
        }
    }
}