import type { FastifyInstance } from "fastify";
import { getAi } from "./text-to-speech";
import * as z from "zod";

const getSystemInstruction = (style: string, consistency: boolean) => {
    return `You are an expert AI art director and prompt engineer. Your task is to transform timestamped script lines into production-ready image generation prompts.

TARGET VIDEO VISUAL STYLE: ${style}
CHARACTER & ENVIRONMENT CONSISTENCY: ${consistency ? "ENABLED. Ensure core character features, clothing, and environment aesthetics remain strictly consistent across all generated scene prompts." : "DISABLED. Each prompt can vary independently."}

CRITICAL OUTPUT FORMATTING RULES:
1. Output individual JSON objects one per line (NDJSON format). DO NOT wrap them in a JSON array [].
2. DO NOT use markdown code blocks (\`\`\`json).
3. Each line must be a valid JSON object matching this structure: {"time": "[0:00]", "prompt": "your prompt here"}`;
}


const promptSchema = z.object({
    time: z.string().describe("The script time format like [0:00]."),
    prompt: z.string().describe("The prompt based on the script.")
});

export async function GeneratePrompts(app: FastifyInstance) {

    app.options("/api/generate-prompts", async (req, reply) => {
        return reply.code(204).send();
    });

    app.post("/api/generate-prompts", async (req, reply) => {
        const ai = getAi();
        const { script, style, consistency } = req.body as {
            script: string;
            style: string;
            consistency: boolean;
        };

        if (!script || !script.trim()) {
            return reply.code(400).send({ error: "Missing required script parameter." });
        }

        try {


            const responseStream = await ai.interactions.create({
                model: 'gemini-2.5-flash',
                input: [
                    { type: "text", text: `Please generate the image prompts for the following timestamped script:\n\n${script}` }
                ],
                system_instruction: getSystemInstruction(style, consistency),
                response_format: {
                    type: 'text',
                    mime_type: 'application/json',
                    schema: promptSchema
                },
                stream: true
            });


            reply.raw.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*", // Match frontend URL or leave wildcard if debugging
            });


            for await (const chunk of responseStream) {
                if (chunk.event_type === "error") {
                    reply.raw.write(JSON.stringify({
                        error: "plan",
                        message: "You exceeded your current quota."
                    }));
                    reply.raw.end();
                    return;
                }
                if (chunk.event_type === "step.delta") {
                    if (chunk.delta?.type === "text") {
                        reply.raw.write(chunk.delta.text);
                    }
                }
            }
            reply.raw.end();

        } catch (error: any) {
            req.log.error(error);
            if (!reply.raw.headersSent) {
                return reply.code(500).send({ error: error.message || "Internal server error during prompt generation." });
            } else {
                reply.raw.end();
            }
        }

    })

}
