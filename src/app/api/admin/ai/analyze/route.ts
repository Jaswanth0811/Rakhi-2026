import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/security";
import { analyzeSisterMessage } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { sisterId, message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Sister final message is required for AI analysis." },
        { status: 400 }
      );
    }

    // Call Gemini 2.5 Flash analyzer to generate custom theme and song recommendations
    const analysis = await analyzeSisterMessage(message);

    // Create a unique AI Generated Theme record in DB for this sister
    const createdTheme = await db.theme.create({
      data: {
        name: analysis.generatedTheme.name,
        description: analysis.generatedTheme.description,
        configuration: JSON.stringify({
          primaryColor: analysis.generatedTheme.primaryColor,
          secondaryColor: analysis.generatedTheme.secondaryColor,
          backgroundColor: analysis.generatedTheme.backgroundColor,
          accentColor: analysis.generatedTheme.accentColor,
          particleColor: analysis.generatedTheme.particleColor,
          cardBackground: analysis.generatedTheme.cardBackground,
          colors: [
            analysis.generatedTheme.primaryColor,
            analysis.generatedTheme.secondaryColor,
            analysis.generatedTheme.accentColor,
            analysis.generatedTheme.particleColor,
          ],
        }),
      },
    });

    // If sisterId exists, associate created theme with sister
    if (sisterId && sisterId !== "temp") {
      await db.sister.update({
        where: { id: sisterId },
        data: {
          themeId: createdTheme.id,
          motionStyle: analysis.motionStyle,
        },
      });

      await db.aIRecommendation.create({
        data: {
          sisterId,
          messageSnapshot: message.substring(0, 500),
          mood: analysis.mood,
          tone: analysis.tone,
          visualDirection: analysis.visualDirection,
          motionStyle: analysis.motionStyle,
          recommendedThemeId: createdTheme.id,
          aiResponse: JSON.stringify({
            ...analysis,
            createdTheme,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        createdTheme,
      },
    });
  } catch (error) {
    console.error("AI Analyze API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze message with Gemini 2.5 Flash." },
      { status: 500 }
    );
  }
}
