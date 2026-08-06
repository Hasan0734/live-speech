import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { S3Client } from '@aws-sdk/client-s3';

// 1. Declare custom TypeScript definitions so app.s3 doesn't throw type errors
declare module "fastify" {
  interface FastifyInstance {
    s3: S3Client;
  }
}

async function s3Plugin(app: FastifyInstance) {
  const s3 = new S3Client({
    forcePathStyle: true,
    region: process.env.SUPBASE_REGION,
    endpoint: process.env.SUPABASE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.SUPABASE_ACCESS_KEY!,
      secretAccessKey: process.env.SUPABASE_SECRET_ACCESS!,
    },
  });

  app.decorate("s3", s3);
}

export default fp(s3Plugin);
