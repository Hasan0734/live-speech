import type { FastifyInstance } from "fastify";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from "uuid";


const ALLOWED_MIME_TYPES = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3']




export async function UploadAudio(app: FastifyInstance) {


    const s3 = new S3Client({
        forcePathStyle: true, // Required for Supabase S3 API compatibility
        region: process.env.SUPBASE_REGION,
        endpoint: process.env.SUPABASE_ENDPOINT, // S3 URL from settings
        credentials: {
            accessKeyId: process.env.SUPABASE_ACCESS_KEY!,
            secretAccessKey: process.env.SUPABASE_SECRET_ACCESS!,
        },
    })



    app.post("/api/upload", async (req, reply) => {

        const data = await req.file();
        if (!data) {
            return reply.code(400).send({ error: "No file uploaded" })
        }


        if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
            data.file.resume();
            return reply.code(400).send({
                error: `Invalid file type: ${data.mimetype}. Only MP3 OR WAV are allowed.`
            })
        }


        try {
        

            const uniqueFilename = uuidv4()


            // Pass the raw data.file stream straight into the S3 Upload manager
            const parallelUpload = new Upload({
                client: s3,
                params: {
                    Bucket: 'uploads-audio',
                    Key: uniqueFilename,
                    Body: data.file, // Native stream input 
                    ContentType: data.mimetype,
                },
                queueSize: 4,
                partSize: 5 * 1024 * 1024, // 5MB chunks
            });

            await parallelUpload.done();
            const encodedFilename = encodeURIComponent(uniqueFilename);
            // const publicUrl = `https://eftrlayngrniqterscdf.supabase.co/storage/v1/object/public/uploads-audio/${encodedFilename}`;

            return {
                message: "File uploaded successfully",
                filename: data.filename,
                key: uniqueFilename
            }

        } catch (err: any) {
            return reply.status(500).send({ error: err.message });
        }


    })
}