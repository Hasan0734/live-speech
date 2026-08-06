import type { FastifyInstance } from "fastify";
import { getAi } from "./text-to-speech";
import path from 'path';
import fs from 'fs'
import { pipeline } from "stream/promises";
import { GetObjectCommand } from '@aws-sdk/client-s3';


const systemInstruction =
    `You are a precise audio transcription tool. Your task is to transcribe the provided audio text word-for-word.
        
        CRITICAL OUTPUT FORMATTING RULES:
        1. Every line MUST begin with a timestamp indicating when the sentence started.
        2. Format the timestamp exactly as [M:SS] or [MM:SS] depending on length (e.g., 0:01, 2:14, 11:05). Do not use milliseconds.
        3. Follow the timestamp immediately with the verbatim text spoken.
        4. Do not wrap the output in markdown blockquotes or summary text blocks. Return raw string segments.
        
        EXAMPLE OUTPUT FORMAT:
        0:01 hello world
        0:04 thank you for joining this conversation today
        0:09 we will be discussing the new updates`;



export async function Transcribe(app: FastifyInstance) {


    app.post("/api/transcribe", async (req, reply) => {
        const ai = getAi();
        const { key, mimetype } = req.body as { key: string; mimetype: string };

        if (!key || !mimetype) {
            return reply.code(400).send({ error: "Missing required key or mimetype parameters." });
        }

        let tempFilePath = "";
        let geminiFileRef: any = null;

        try {
            // 1. Fetch file stream from private S3 bucket
            const s3Response = await app.s3.send(new GetObjectCommand({
                Bucket: 'uploads-audio',
                Key: key
            }));

            if (!s3Response.Body) {
                return reply.code(404).send({ error: "Audio file not found in S3 storage." });
            }

            tempFilePath = path.join(process.cwd(), `temp_${key}`);
            await pipeline(s3Response.Body as any, fs.createWriteStream(tempFilePath));

            // 2. Upload file to Google Gemini's File API sandbox
            geminiFileRef = await ai.files.upload({
                file: tempFilePath,
                config: {
                    mimeType: mimetype || "audio/mpeg"
                }
            });

            // 3. Configure HTTP response headers for Server-Sent Events (SSE) streaming 
            reply.raw.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*", // Match frontend URL or leave wildcard if debugging
            });

            // 4. Initialize Gemini native chunk streaming
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

                system_instruction: systemInstruction,
                stream: true
            });



            for await (const event of responseStream) {
                if (event.event_type === "step.delta") {
                    if (event.delta.type === "text") {
                        // process.stdout.write(event.delta.text);
                        console.log(event)
                        console.log(event.delta.text)
                        reply.raw.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
                    }
                }
            }
            reply.raw.write(`data: [DONE]\n\n`);
            reply.raw.end();
            // // 5. Intercept streaming fragments and pump them directly down the SSE socket pipe
            // for await (const chunk of responseStream) {
            //     if (chunk.text) {
            //         // SSE format requires starting with "data: " and ending with two newlines (\n\n)
            //         reply.raw.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            //     }
            // }

            // // 6. Signal to frontend that the stream is complete
            // reply.raw.write(`data: [DONE]\n\n`);
            // reply.raw.end();

        } catch (error: any) {
            // app.log.error(error);
            // Fallback response if failure happens before streaming protocol starts
            if (!reply.raw.writableEnded) {
                reply.raw.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
                reply.raw.end();
            }
        } finally {
            // // 7. Cleanup tasks: delete file from server memory and Gemini storage
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            if (geminiFileRef?.name) {
                await ai.files.delete({ name: geminiFileRef.name }).catch(() => null);
            }
        }

    })

}


// {"storagePath":"9311f3b5-6583-48cb-8e9b-b56fe402d645.mp3","filename":"speech-zephyr (1).mp3","mode":"fast","clientDuration":"1.52"}