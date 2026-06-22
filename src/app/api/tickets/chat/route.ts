import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a helpful AI assistant for N3xUs Konc3pt'z, a digital agency offering Discord bots, Telegram bots, web development, and digital services.
Your job is to answer the user's questions about our services. If the user asks something you don't know, or wants to start a project, or wants to talk to a human, reply exactly with: 
[ESCALATE_TO_HUMAN]
Do NOT use that tag unless absolutely necessary. Be concise, polite, and use a cyberpunk/neon aesthetic tone.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "No API Key configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. Awaiting user input." }] },
        ...formattedHistory
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    if (responseText.includes("[ESCALATE_TO_HUMAN]")) {
      return NextResponse.json({ escalate: true });
    }

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
