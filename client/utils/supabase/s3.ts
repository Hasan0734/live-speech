import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    forcePathStyle: true,
    region: process.env.SUPBASE_REGION,
    endpoint: process.env.SUPABASE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.SUPABASE_ACCESS_KEY!,
        secretAccessKey: process.env.SUPABASE_SECRET_ACCESS!,
    },
});