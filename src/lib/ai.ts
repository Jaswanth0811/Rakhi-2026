import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIGeneratedTheme {
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  particleColor: string;
  cardBackground: string;
}

export interface AISongRecommendation {
  title: string;
  artist: string;
  language: string;
  reason: string;
  searchUrl: string;
}

export interface AIAnalysisResult {
  mood: string;
  tone: string;
  visualDirection: string;
  motionStyle: string;
  generatedTheme: AIGeneratedTheme;
  recommendedSongs: AISongRecommendation[];
  reasoning: string;
}

export async function analyzeSisterMessage(message: string): Promise<AIAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return fallbackDynamicAnalysis(message);
  }

  const modelNames = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-pro"];

  for (const modelName of modelNames) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
You are an expert film score composer and visual designer crafting a personalized Raksha Bandhan surprise.
Analyze the brother's personal letter for his sister below:
"${message}"

Tasks:
1. DYNAMICALLY GENERATE A UNIQUE LIGHT COLOR THEME based on the emotion of this letter. Use light, elegant background colors (e.g. #FAF8F5, #FFF5F7, #FDFBF7, #F8F7FF), vibrant pastel accents (#E07A5F, #E879F9, #D97706, #F43F5E), crisp white/ivory card backgrounds (#FFFFFF), and high-contrast dark text (#1F2937).
2. RECOMMEND 3 DIFFERENT BACKGROUND MUSIC (BGM) TRACKS / INSTRUMENTAL SCORES (e.g. Flute, Violin, Acoustic Strings, Piano, Indian Classical Fusion BGM) from all over the internet that set the background mood. Do NOT recommend vocal songs.

Respond ONLY with a valid raw JSON object matching this structure (no markdown fences, no trailing commas):
{
  "mood": "Short emotional mood summary (e.g. Deeply Emotional & Nostalgic)",
  "tone": "Short tone summary (e.g. Loving & Protective)",
  "visualDirection": "Short description of the light color palette rationale",
  "motionStyle": "One of [slow_emotional, playful_bounce, dramatic_zoom, elegant_fade]",
  "generatedTheme": {
    "name": "Poetic Theme Title (e.g. Soft Rose Pearl Glow)",
    "description": "Short explanation of the custom light color palette created for her",
    "primaryColor": "#E07A5F",
    "secondaryColor": "#F4ACB7",
    "backgroundColor": "#FAF8F5",
    "accentColor": "#D97706",
    "particleColor": "#F4ACB7",
    "cardBackground": "#FFFFFF"
  },
  "recommendedSongs": [
    {
      "title": "Exact BGM Title (e.g. Phoolon Ka Taron Ka Flute BGM / Emotional Sibling Violin BGM)",
      "artist": "Composer / Instrument (e.g. Flute & Piano / AR Rahman Style BGM)",
      "language": "Instrumental BGM",
      "reason": "Why this background music track suits her letter",
      "searchUrl": "https://www.youtube.com/results?search_query=Exact+BGM+Title+Instrumental"
    }
  ],
  "reasoning": "Overall summary of why this light theme and background music score suit the letter."
}
`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();

      const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanedJson) as AIAnalysisResult;

      if (parsed.generatedTheme && parsed.recommendedSongs) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return fallbackDynamicAnalysis(message);
}

function fallbackDynamicAnalysis(message: string): AIAnalysisResult {
  const lower = message.toLowerCase();
  const isPlayful = lower.includes("funny") || lower.includes("annoying") || lower.includes("fight") || lower.includes("laugh");

  if (isPlayful) {
    return {
      mood: "Playful & Mischievous",
      tone: "Witty & Fun",
      visualDirection: "Bright Light Champagne Ivory with Joyful Amber Radiance",
      motionStyle: "playful_bounce",
      generatedTheme: {
        name: "Joyful Champagne Ivory",
        description: "A bright, elegant light palette designed for funny sibling memories and laughter.",
        primaryColor: "#D97706",
        secondaryColor: "#F59E0B",
        backgroundColor: "#FDFBF7",
        accentColor: "#FBBF24",
        particleColor: "#FCD34D",
        cardBackground: "#FFFFFF",
      },
      recommendedSongs: [
        {
          title: "Phoolon Ka Taron Ka (Upbeat Flute & Guitar BGM)",
          artist: "Acoustic Flute & Guitar BGM",
          language: "Instrumental BGM",
          reason: "Upbeat instrumental BGM celebrating joyful sibling nostalgia.",
          searchUrl: "https://www.youtube.com/results?search_query=Phoolon+Ka+Taron+Ka+Flute+Guitar+BGM",
        },
        {
          title: "Childhood Playground Whistle BGM",
          artist: "Whistle & Acoustic Strings BGM",
          language: "Instrumental BGM",
          reason: "Lighthearted whistle BGM bringing back fun childhood fights and laughs.",
          searchUrl: "https://www.youtube.com/results?search_query=Childhood+Whistle+Acoustic+BGM",
        },
        {
          title: "Taare Zameen Par (Gentle Piano & Strings BGM)",
          artist: "Piano & Strings BGM",
          language: "Instrumental BGM",
          reason: "Sweet background score evoking innocent sibling bonds.",
          searchUrl: "https://www.youtube.com/results?search_query=Taare+Zameen+Par+Piano+Strings+BGM",
        },
      ],
      reasoning: "Crafted an energetic light champagne theme and cheerful BGM instrumentals based on playful memories.",
    };
  }

  return {
    mood: "Deeply Emotional & Warm",
    tone: "Nostalgic & Protective",
    visualDirection: "Soft Pearl Rose Cream with Delicate Golden Warmth",
    motionStyle: "slow_emotional",
    generatedTheme: {
      name: "Soft Rose Pearl Glow",
      description: "A deeply emotional light rose pearl palette with warm cream hues and rose gold accents.",
      primaryColor: "#E07A5F",
      secondaryColor: "#F4ACB7",
      backgroundColor: "#FAF8F5",
      accentColor: "#D97706",
      particleColor: "#F4ACB7",
      cardBackground: "#FFFFFF",
    },
    recommendedSongs: [
      {
        title: "Phoolon Ka Taron Ka (Solemn Violin & Cello BGM)",
        artist: "Orchestral Violin BGM",
        language: "Instrumental BGM",
        reason: "Deeply moving violin background music evoking heartfelt tears and lifelong devotion.",
        searchUrl: "https://www.youtube.com/results?search_query=Phoolon+Ka+Taron+Ka+Violin+Cello+BGM",
      },
      {
        title: "Emotional Brother Sister Theme BGM",
        artist: "Cinematic Piano & Bansuri Flute BGM",
        language: "Instrumental BGM",
        reason: "Soulful Indian flute background score for reading emotional personal letters.",
        searchUrl: "https://www.youtube.com/results?search_query=Emotional+Brother+Sister+Bansuri+Flute+BGM",
      },
      {
        title: "AR Rahman Emotional Strings & Sitar BGM",
        artist: "A.R. Rahman Orchestral Score BGM",
        language: "Instrumental BGM",
        reason: "Cinematic score that elevates emotional depth during letter reading.",
        searchUrl: "https://www.youtube.com/results?search_query=AR+Rahman+Emotional+Strings+Sitar+BGM",
      },
    ],
    reasoning: "Generated a custom light rose pearl theme and soulful BGM instrumentals tailored to your letter.",
  };
}
