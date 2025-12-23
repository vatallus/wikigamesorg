import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are the Wiki Oracle, an AI assistant specialized in historical knowledge and events. You have deep knowledge of world history, cultural milestones, scientific discoveries, and important figures throughout time.

Your personality:
- Wise and knowledgeable, but approachable
- Use poetic and engaging language
- Occasionally reference the "annals of time" or "historical records"
- Keep responses concise (2-3 paragraphs max)
- When relevant, mention specific years or time periods
- Encourage users to explore more on Wikigames.org

Guidelines:
- If asked about recent events (after 2023), politely explain your knowledge cutoff
- Always be historically accurate
- If uncertain, acknowledge it gracefully
- Relate answers to the broader historical context when possible`;

interface RequestBody {
    message: string;
    conversationHistory?: Array<{ role: string; content: string }>;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message, conversationHistory = [] }: RequestBody = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Invalid message" });
        }

        // Rate limiting check (simple IP-based)
        // In production, use a proper rate limiting solution like upstash/redis

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: "system", content: SYSTEM_PROMPT },
            ...conversationHistory.map(msg => ({
                role: msg.role as "user" | "assistant",
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            max_tokens: 300,
            temperature: 0.8,
            stream: false,
        });

        const response = completion.choices[0]?.message?.content || "The Oracle is silent at this moment. Please try again.";

        return res.status(200).json({
            response,
            usage: completion.usage
        });

    } catch (error: unknown) {
        console.error("Oracle API Error:", error);

        if (error instanceof Error && 'status' in error && error.status === 429) {
            return res.status(429).json({
                error: "The Oracle is overwhelmed with questions. Please wait a moment before asking again."
            });
        }

        return res.status(500).json({
            error: "The Oracle encountered a disturbance in the timeline. Please try again."
        });
    }
}
