import type { FastifyInstance } from "fastify";
import type { Socket } from "socket.io";
import { GoogleGenAI, LiveServerMessage, Modality, MediaResolution, Session } from '@google/genai';
import { writeFile } from 'fs';


const responseQueue: LiveServerMessage[] = [];

interface WavConversionOptions {
    numChannels: number,
    sampleRate: number,
    bitsPerSample: number
}



async function handleTurn(): Promise<LiveServerMessage[]> {
    const turn: LiveServerMessage[] = [];
    let done = false;
    while (!done) {
        const message = await waitMessage();
        turn.push(message);
        if (message.serverContent && message.serverContent.turnComplete) {
            done = true;
        }
    }
    return turn;
}

async function waitMessage(): Promise<LiveServerMessage> {
    let done = false;
    let message: LiveServerMessage | undefined = undefined;
    while (!done) {
        message = responseQueue.shift();
        if (message) {
            handleModelTurn(message);
            done = true;
        } else {
            await new Promise((resolve) => { setTimeout(resolve, 100); });
        }
    }
    return message!;
}

let audioChunks: Buffer[] = [];
let detectedSampleRate = 24000;
const audioParts: string[] = [];
function handleModelTurn(message: LiveServerMessage) {
    if (message.serverContent?.modelTurn?.parts) {
        const part = message.serverContent?.modelTurn?.parts?.[0];

        if (part?.fileData) {
            console.log(`File: ${part?.fileData.fileUri}`);
        }

        if (part?.inlineData) {
            const fileName = `audio.wav`;
            const inlineData = part?.inlineData;

            audioParts.push(inlineData?.data ?? '');

            const buffer = convertToWav(audioParts, inlineData.mimeType ?? '');
            saveBinaryFile(fileName, buffer);
        }

        if (part?.text) {
            console.log(part?.text);
        }
    }
}

function saveBinaryFile(fileName: string, content: Buffer) {
    // TODO: go/ts59upgrade - Remove this suppression after TS 5.9.2 upgrade
    //   error TS2345: Argument of type 'Buffer' is not assignable to parameter of type 'string | ArrayBufferView'.
    // @ts-ignore
    writeFile(fileName, content, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing file ${fileName}:`, err);
            return;
        }
        console.log(`Appending stream content to file ${fileName}.`);
    });
}

function convertToWav(rawData: string[], mimeType: string) {
    const options = parseMimeType(mimeType);
    const dataLength = rawData.reduce((a, b) => a + b.length, 0);
    const wavHeader = createWavHeader(dataLength, options);
    const buffer = Buffer.concat(
        // TODO: go/ts59upgrade - Remove this suppression after TS 5.9.2 upgrade
        //   error TS2345: Argument of type 'Buffer[]' is not assignable to parameter of type 'readonly Uint8Array<ArrayBufferLike>[]'.
        // @ts-ignore
        rawData.map(data => Buffer.from(data, 'base64')));

    // TODO: go/ts59upgrade - Remove this suppression after TS 5.9.2 upgrade
    // error TS2322: Type 'Buffer' is not assignable to type 'Uint8Array<ArrayBufferLike>'.
    // @ts-ignore
    return Buffer.concat([wavHeader, buffer]);
}

function parseMimeType(mimeType: string) {
    const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
    // @ts-ignore
    const [, format] = fileType.split('/');

    const options: Partial<WavConversionOptions> = {
        numChannels: 1,
        bitsPerSample: 16,
    };

    if (format && format.startsWith('L')) {
        const bits = parseInt(format.slice(1), 10);
        if (!isNaN(bits)) {
            options.bitsPerSample = bits;
        }
    }

    for (const param of params) {
        const [key, value] = param.split('=').map(s => s.trim());
        if (key === 'rate') {
            options.sampleRate = parseInt(value as string, 10);
        }
    }

    return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
    const {
        numChannels,
        sampleRate,
        bitsPerSample,
    } = options;

    // http://soundfile.sapp.org/doc/WaveFormat

    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const buffer = Buffer.alloc(44);

    buffer.write('RIFF', 0);                      // ChunkID
    buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
    buffer.write('WAVE', 8);                      // Format
    buffer.write('fmt ', 12);                     // Subchunk1ID
    buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
    buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
    buffer.writeUInt16LE(numChannels, 22);        // NumChannels
    buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
    buffer.writeUInt32LE(byteRate, 28);           // ByteRate
    buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
    buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSample
    buffer.write('data', 36);                     // Subchunk2ID
    buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

    return buffer;
}

export async function websocketRoutes(app: FastifyInstance) {

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });


    const model = 'models/gemini-3.1-flash-live-preview'

    const config = {
        responseModalities: [
            Modality.AUDIO,
        ],
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
        speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: {
                    voiceName: 'Zephyr',
                }
            }
        },
        contextWindowCompression: {
            triggerTokens: '104857',
            slidingWindow: { targetTokens: '52428' },
        },
    };




    // await InitGeminiSession()

    app.io.on("connection", async (socket: Socket) => {
        app.log.info('Client connected via WebSocket');

        let geminiSession: Session | undefined = undefined;

        async function InitGeminiSession() {
            try {
                geminiSession = await ai.live.connect({
                    model,
                    callbacks: {
                        onopen: function () {
                            console.log("Opened")
                        },
                        onmessage(message: LiveServerMessage) {
                            const parts = message.serverContent?.modelTurn?.parts ?? [];

                            for (const part of parts) {
                                // Collect PCM raw byte buffers
                                if (part.inlineData?.data) {
                                    const buffer = Buffer.from(part.inlineData.data, "base64");
                                    audioChunks.push(buffer);

                                    // Dynamically extract sample rate from mimeType if present
                                    if (part.inlineData.mimeType) {
                                        const match = part.inlineData.mimeType.match(/rate=(\d+)/);
                                        if (match && match[1]) {
                                            detectedSampleRate = parseInt(match[1], 10);
                                        }
                                    }
                                }

                                // Optional streaming text transcript
                                if (part.text) {
                                    socket.emit("gemini:text", part.text);
                                }
                            }

                            // Turn complete -> Build complete WAV & send as Data URI
                            if (message.serverContent?.turnComplete) {
                                if (audioChunks.length > 0) {
                                    const pcm = Buffer.concat(audioChunks);

                                    const wavHeader = createWavHeader(pcm.length, {
                                        numChannels: 1,
                                        sampleRate: detectedSampleRate,
                                        bitsPerSample: 16,
                                    });

                                    const fullWav = Buffer.concat([wavHeader, pcm]);

                                    // Send full base64 data URI directly to frontend player
                                    socket.emit("gemini:audio", {
                                        src: `data:audio/wav;base64,${fullWav.toString("base64")}`,
                                    });

                                    // Clear array for the next turn
                                    audioChunks = [];
                                }

                                socket.emit("gemini:turnComplete");
                            }
                        },
                        onerror: function (e: ErrorEvent) {
                            console.debug('Error:', e.message)
                        },
                        onclose: function (e: CloseEvent) {
                            console.debug('Close:', e.reason);
                        }
                    },
                    config
                })

                // geminiSession.sendClientContent({
                //     turns: [
                //         `INSERT_INPUT_HERE`
                //     ]
                // });
                // await handleTurn()
                // geminiSession.close()
            } catch (error) {
                console.log(error)
            }
        }
        await InitGeminiSession()


        socket.on("text:prompt", async (prompt) => {
            await geminiSession?.sendClientContent({
                turns: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            });
            await handleTurn()
            geminiSession?.close()


            console.log(responseQueue)
        })


        // ---------------- Disconnect ----------------
        socket.on("disconnecting", () => {

            setTimeout(() => {

                console.log("user disconnected!")
            }, 2000);
        });

        socket.on("disconnect", (reason) => {

            app.log.info(`[Socket] ${socket.id} disconnected (${reason})`);
        });

    })

}