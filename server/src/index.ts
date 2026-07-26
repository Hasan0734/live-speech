

import { buildApp } from "./main.ts";
import dotenv from 'dotenv';

dotenv.config();
const app = await buildApp();

await app.listen({
  port: 3001,
  host: "0.0.0.0",
});
