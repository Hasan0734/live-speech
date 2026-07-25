import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

// Register WebSocket plugin
fastify.register(fastifyWebsocket);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

fastify.register(async function (fastify) {
  // Define WebSocket route for Next.js clients
  fastify.get('/ws/live', { websocket: true }, (connection, req) => {
    fastify.log.info('Client connected via WebSocket');

    let geminiSession: any = null;

    // Connect Fastify backend to Gemini Live API
    async function initGeminiSession() {
      try {
        geminiSession = await ai.live.connect({
          model: 'models/gemini-3.1-flash-live-preview',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Zephyr' },
              },
            },
          },
          callbacks: {
            onopen: () => {
              fastify.log.info('Connected to Gemini Live session');
            },
            onmessage: (message: LiveServerMessage) => {
              // Forward Gemini's response (PCM audio, text) straight to Next.js
              connection.socket.send(JSON.stringify(message));
            },
            onerror: (err:any) => {
              fastify.log.error('Gemini error:', err);
              connection.socket.send(JSON.stringify({ error: err.message }));
            },
            onclose: (e:any) => {
              fastify.log.info('Gemini session closed:', e.reason);
              connection.socket.close();
            },
          },
        });
      } catch (err:any) {
        fastify.log.error('Failed to connect to Gemini:', err);
      }
    }

    initGeminiSession();

    // Listen to incoming messages from Next.js Frontend
    connection.socket.on('message', (rawData:any) => {
      if (!geminiSession) return;

      try {
        const payload = JSON.parse(rawData.toString());

        // Standard user text input
        if (payload.text) {
          geminiSession.sendClientContent({
            turns: [payload.text],
          });
        }

        // Live mic audio stream input (base64 PCM)
        if (payload.realtimeInput) {
          geminiSession.sendRealtimeInput(payload.realtimeInput);
        }
      } catch (err:any) {
        fastify.log.error('Error handling client message:', err);
      }
    });

    connection.socket.on('close', () => {
      fastify.log.info('Client disconnected');
      if (geminiSession) {
        geminiSession.close();
      }
    });
  });
});

fastify.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`Fastify server running on ${address}`);
});