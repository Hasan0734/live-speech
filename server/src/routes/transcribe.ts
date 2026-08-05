import type { FastifyInstance } from "fastify";
import { getAi } from "./text-to-speech";
import path from 'path';
import os from 'os';
import fs from 'fs'
import { pipeline } from "stream/promises";


export async function Transcribe(app: FastifyInstance) {


    app.post("/api/transcribe", async (req, reply) => {

        let tempFilePath = null;


        try {
            const ai = getAi();

            const data = await req.file();

            if (!data) {
                return reply.code(400).send({ error: "No audio file provided" })
            }

            tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${data.filename}`);
            await pipeline(data.file, fs.createWriteStream(tempFilePath));

            const uploadResult = await ai.files.upload({
                file: tempFilePath,
                config: {
                    mimeType: data?.mimetype || "audio/mp3"
                }
            })

            const response = await ai.models.generateContent({
                model: "",
                contents: [{ parts: [{ text: "" }] }],
                config: {

                }
            })
        } catch (error) {

        }

    })

}


// {"storagePath":"9311f3b5-6583-48cb-8e9b-b56fe402d645.mp3","filename":"speech-zephyr (1).mp3","mode":"fast","clientDuration":"1.52"}