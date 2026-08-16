import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from "next/server";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { s3 } from '@/utils/supabase/s3';

const ALLOWED_MIME_TYPES = ["audio/wav", "audio/x-wav", "audio/mpeg", "audio/mp3"];

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null; // Assumes the form field name is 'file'

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
            {
                error: `Invalid file type: ${file.type}. Only MP3 OR WAV are allowed.`,
            },
            { status: 400 }
        );
    }

    try {

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uniqueFilename = uuidv4()

        const parallelUpload = new Upload({
            client: s3,
            params: {
                Bucket: 'uploads-audio',
                Key: uniqueFilename,
                Body: buffer,
                ContentType: file.type,
            },
            queueSize: 4,
            partSize: 5 * 1024 * 1024, // 5MB chunks
        });

        await parallelUpload.done();
        // const encodedFilename = encodeURIComponent(uniqueFilename);

        return NextResponse.json({
            message: "File uploaded successfully",
            filename: file.name,
            key: uniqueFilename,
        });
    } catch (err: any) {

        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }


}