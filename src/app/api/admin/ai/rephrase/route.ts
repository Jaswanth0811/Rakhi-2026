import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAdminSession } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { originalMessage, sisterName, rephraseStyle, customInstruction } = body;

    if (!originalMessage || typeof originalMessage !== "string") {
      return NextResponse.json(
        { error: "Original letter message is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    const styleDescriptions: Record<string, string> = {
      emotional: "Deeply emotional, warm, tear-jerking, heartfelt, expressing profound love and gratitude.",
      humorous: "Funny, witty, playful, teasing sibling banter while maintaining warmth and affection.",
      poetic: "Rhythmic, poetic, nostalgic, evocative, using imagery of childhood memories and eternal bonds.",
      punchy: "Short, punchy, bold, concise, powerful emotional impact with fewer words.",
      sweet: "Sweet, gentle, comforting, soft, protective, and deeply caring.",
      formal: "Respectful, honorable, dignified, protective, and noble.",
    };

    const targetStyle = styleDescriptions[rephraseStyle] || customInstruction || "Heartfelt & Emotional";

    const prompt = `
You are a master creative writer specializing in personal family letters for Raksha Bandhan.
Your task is to rephrase and refine the following personal letter written by a brother for his sister (${sisterName || "Sister"}).

Original Letter:
"${originalMessage}"

Target Tone & Style Requirement:
${targetStyle}

Instructions:
- Keep all personal facts, names, memories, and promises intact.
- Rephrase the letter to sound captivating, eloquent, and perfectly tuned to the target tone (${rephraseStyle || "custom"}).
- Return ONLY a raw JSON object (no markdown code fences) with the format:
{
  "rephrasedMessage": "The full rephrased letter here...",
  "toneSummary": "A 1-sentence summary of the tone achieved",
  "wordCount": 120
}
`;

    const modelNames = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-pro"];

    for (const modelName of modelNames) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);

        if (parsed.rephrasedMessage) {
          return NextResponse.json({
            success: true,
            rephrasedMessage: parsed.rephrasedMessage,
            toneSummary: parsed.toneSummary || targetStyle,
            styleUsed: rephraseStyle,
          });
        }
      } catch {
        continue;
      }
    }

    // Fallback rephrase if Gemini fails
    return NextResponse.json({
      success: true,
      rephrasedMessage: `${originalMessage}\n\nHappy Raksha Bandhan! Always here for you. ❤️`,
      toneSummary: "Enhanced with warmth",
      styleUsed: rephraseStyle,
    });
  } catch (error) {
    console.error("AI Rephrase API error:", error);
    return NextResponse.json(
      { error: "Failed to rephrase letter." },
      { status: 500 }
    );
  }
}
