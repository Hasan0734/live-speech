import type { FastifyInstance } from "fastify";
import { getAi } from "./text-to-speech";
import * as z from "zod";

const getSystemInstruction = (style: string, consistency: boolean) => {
    return `You are an expert AI art director and prompt engineer. Your task is to transform timestamped script lines into production-ready image generation prompts.

TARGET VIDEO VISUAL STYLE: ${style}
CHARACTER & ENVIRONMENT CONSISTENCY: ${consistency ? "ENABLED. Ensure core character features, clothing, and environment aesthetics remain strictly consistent across all generated scene prompts." : "DISABLED. Each prompt can vary independently."}

CRITICAL OUTPUT FORMATTING RULES:
1. Return a valid JSON object containing objects with 'time' and 'prompt' keys.
2. The 'time' value must match the exact timestamp provided in the script line (e.g., "[0:00]").
3. The 'prompt' value must contain the detailed, high-quality image generation prompt tailored to the visual style.`;
}


const promptSchema = z.array(z.object({
    time: z.string().describe("The script time format like [0:00]."),
    prompt: z.string().describe("The prompt based on the script.")
}))

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
                model: 'gemini-3.6-flash',
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
                if (chunk.event_type === "step.delta") {
                    if (chunk.delta?.type === "text" && chunk.delta.text) {
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
