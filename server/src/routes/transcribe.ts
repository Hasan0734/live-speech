import type { FastifyInstance } from "fastify";
import { getAi } from "./text-to-speech";
import path from 'path';
import os from 'os';
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
        const ai = getAi()
        const { key, mimetype } = req.body as { key: string; mimetype: string };
        if (!key || !mimetype) {
            return reply.code(400).send({ error: "Missing required key or mimetype parameters." });
        }

        let tempFilePath = "";
        let geminiFileRef: any = null;

        try {
            const s3Response = await app.s3.send(new GetObjectCommand({
                Bucket: 'uploads-audio',
                Key: key
            }));

            if (!s3Response.Body) {
                return reply.code(404).send({ error: "Audio file not found in S3 storage." });
            }

            tempFilePath = path.join(process.cwd(), `temp_${key}`);
            await pipeline(s3Response.Body as any, fs.createWriteStream(tempFilePath));

            geminiFileRef = await ai.files.upload({
                file: tempFilePath,
                config: {
                    mimeType: mimetype || "audio/mpeg"

                }
            });

            const response = await ai.interactions.create({
                model: 'gemini-2.5-flash',
                system_instruction: systemInstruction,
                input: [
                    {
                        type: "audio",
                        uri: geminiFileRef.uri,
                        mime_type: geminiFileRef.mimeType
                    }

                ],
                // stream: true
            });

            console.log({ response })

            return { success: true, text: response.output_text };


            // const response = await ai.models.generateContent({
            //     model: "",
            //     contents: [{ parts: [{ text: "" }] }],
            //     config: {

            //     }
            // })
        } catch (error) {
            console.log(error)
        }

    })

}


// {"storagePath":"9311f3b5-6583-48cb-8e9b-b56fe402d645.mp3","filename":"speech-zephyr (1).mp3","mode":"fast","clientDuration":"1.52"}