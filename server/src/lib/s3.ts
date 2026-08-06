// import fp from 'fastify-plugin';
// import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'
// import type { FastifyInstance } from 'fastify';

// declare module 'fastify' {
//   interface FastifyInstance {
//     s3: S3ClientConfig
//   }
// }

// export default fp(async function (fastify: FastifyInstance) {
//     const s3 = new S3Client({
//         forcePathStyle: true, // Required for Supabase S3 API compatibility
//         region: process.env.SUPBASE_REGION,
//         endpoint: process.env.SUPABASE_ENDPOINT, // S3 URL from settings
//         credentials: {
//             accessKeyId: process.env.SUPABASE_ACCESS_KEY!,
//             secretAccessKey: process.env.SUPABASE_SECRET_ACCESS!,
//         },
//     })

//     fastify.decorate('s3', s3);
// })