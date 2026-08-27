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

export interface AIReactionResult {
  responseMessage: string;
  animationType: string;
}

export interface AIAnswerContext {
  question: string;
  questionType?: string;
  answer: string;
  options?: Array<{ label: string; value?: string }>;
  photoContext?: string | null;
  recentHistory?: Array<{ question: string; answer: string }>;
  sisterName?: string;
}

export interface AIExperienceSummaryResult {
  title: string;
  summaryMessage: string;
  highlightTheme?: string;
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

/**
 * Generates an AI-Powered "Response Message" dynamically based on:
 * Question + Sister's Answer + Question Type + Options + Photo Metadata + Recent History.
 */
export async function generateAIAnswerReaction(
  contextOrQuestion: string | AIAnswerContext,
  legacyAnswer?: string,
  legacySisterName: string = "Sister"
): Promise<AIReactionResult> {
  // Normalize parameters
  let context: AIAnswerContext;
  if (typeof contextOrQuestion === "string") {
    context = {
      question: contextOrQuestion,
      answer: legacyAnswer || "",
      sisterName: legacySisterName,
    };
  } else {
    context = contextOrQuestion;
  }

  const {
    question,
    questionType = "multiple_choice",
    answer,
    options = [],
    photoContext,
    recentHistory = [],
    sisterName = "Sister",
  } = context;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== "") {
    const modelNames = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"];

    // Format options context
    const optionsText = options.length > 0
      ? `Available options: [${options.map((o) => o.label).join(", ")}]`
      : "";

    // Format recent history context
    const historyText = recentHistory.length > 0
      ? `Recent answers in this questionnaire:\n` +
        recentHistory.map((h, i) => `${i + 1}. Q: "${h.question}" -> A: "${h.answer}"`).join("\n")
      : "";

    const prompt = `
You are a loving, playful, slightly teasing, warm brother on Raksha Bandhan reacting directly to your sister ${sisterName} during an interactive Rakhi questionnaire.

Question Type: ${questionType}
Question: "${question}"
${optionsText}
${photoContext ? `Selected Photo Context: "${photoContext}"` : ""}
Her Answer: "${answer}"
${historyText}

Personality & Guidelines:
1. Write a 1-sentence lively, natural sibling Response Message (warm, humorous, playfully teasing, or deeply heartfelt).
2. React SPECIFICALLY to what she answered.
   - If Multiple Choice: React to why she picked that choice among the options.
   - If Yes/No: Give a distinct, funny or emotional reaction for YES vs NO.
   - If Emoji: Interpret the humorous or emotional meaning of the emoji in context of the question.
   - If Rating Slider: Understand Question + Rating together (e.g. 10/10 annoyance vs 10/10 best brother).
   - If Text Box: React genuinely to her exact typed words.
   - If Photo Choice: Warmly acknowledge the memory photo lovingly without hallucinating new facts.
   - If Recent History is provided: Naturally and wittily connect to an earlier answer when appropriate.
3. Keep it punchy (under 18 words).
4. Strictly NEVER sound like an AI, chatbot, or survey (NO "Thank you for your response", "As an AI", "Great choice!", "Your answer has been recorded").
5. Choose one animationType from: ["confetti", "celebration", "emotional", "funny_shake", "happy"].

Respond ONLY in raw JSON format:
{
  "responseMessage": "Your 1-sentence natural reaction here!",
  "animationType": "confetti"
}
`;

    for (const modelName of modelNames) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned) as AIReactionResult;

        if (parsed.responseMessage && parsed.responseMessage.trim().length > 0) {
          // Clean quotes if any
          const cleanMsg = parsed.responseMessage.replace(/^["“”]/, "").replace(/["“”]$/, "").trim();
          return {
            responseMessage: cleanMsg,
            animationType: parsed.animationType || "confetti",
          };
        }
      } catch {
        continue;
      }
    }
  }

  // Fast intelligent contextual fallback
  return fallbackAnswerReaction(context);
}

function fallbackAnswerReaction(context: AIAnswerContext): AIReactionResult {
  const {
    question,
    questionType = "multiple_choice",
    answer,
    photoContext,
    sisterName = "Sister",
  } = context;

  const ansLower = (answer || "").toLowerCase().trim();
  const qLower = (question || "").toLowerCase().trim();

  // Photo Memory Choice
  if (questionType === "image_choice" || photoContext) {
    return {
      responseMessage: `Aww, you chose this memory! 🥹❤️ Some moments never get old.`,
      animationType: "emotional",
    };
  }

  // Yes / No Choice
  if (questionType === "yes_no" || ansLower === "yes" || ansLower === "no") {
    if (ansLower.includes("yes") || ansLower.includes("definitely") || ansLower.includes("agree")) {
      return {
        responseMessage: `I knew you had good taste, ${sisterName}! 😌❤️`,
        animationType: "celebration",
      };
    }
    return {
      responseMessage: `WHAT?! 😭 Okay, we are definitely holding a sibling meeting! 😂`,
      animationType: "funny_shake",
    };
  }

  // Rating Slider Choice
  if (questionType === "rating" || !isNaN(Number(answer))) {
    const num = Number(answer);
    if (qLower.includes("annoy") || qLower.includes("trouble") || qLower.includes("irritat")) {
      if (num >= 8) {
        return {
          responseMessage: `${num}/10?! You really had zero mercy on me 😭😂`,
          animationType: "funny_shake",
        };
      }
      return {
        responseMessage: `Only ${num}/10? Wow, I must be on my best behavior! 😇`,
        animationType: "happy",
      };
    }

    if (num >= 8) {
      return {
        responseMessage: `Okay... I'm saving this ${num}/10 rating forever! No take-backs ❤️🌟`,
        animationType: "celebration",
      };
    }
    return {
      responseMessage: `Aha! Anything below 10 is definitely a phone glitch! 😂❤️`,
      animationType: "happy",
    };
  }

  // Emoji Choice
  if (questionType === "emoji") {
    if (ansLower.includes("🥹") || ansLower.includes("🥺") || ansLower.includes("❤️") || ansLower.includes("🥰") || ansLower.includes("💖")) {
      return {
        responseMessage: `Okay... that one emoji says way more than words ever could 🥹❤️`,
        animationType: "emotional",
      };
    }
    if (ansLower.includes("😂") || ansLower.includes("🤣") || ansLower.includes("😜") || ansLower.includes("😆")) {
      return {
        responseMessage: `Yep. That emoji basically summarizes our entire relationship 😂❤️`,
        animationType: "funny_shake",
      };
    }
    if (ansLower.includes("😈") || ansLower.includes("😏") || ansLower.includes("🔥") || ansLower.includes("💥")) {
      return {
        responseMessage: `I knew our bond had a little chaos hiding in it 😈😂`,
        animationType: "celebration",
      };
    }
    return {
      responseMessage: `Haha, that emoji is 100% accurate for us! ✨`,
      animationType: "happy",
    };
  }

  // Text Response Box
  if (questionType === "text") {
    if (ansLower.includes("thank") || ansLower.includes("support") || ansLower.includes("love") || ansLower.includes("care")) {
      return {
        responseMessage: `You never have to thank me for that. I will always be there for you ❤️🥹`,
        animationType: "emotional",
      };
    }
    if (ansLower.includes("annoy") || ansLower.includes("idiot") || ansLower.includes("crazy") || ansLower.includes("stupid")) {
      return {
        responseMessage: `And yet somehow you still keep me around as your brother 😂❤️`,
        animationType: "funny_shake",
      };
    }
    return {
      responseMessage: `Reading this means more to me than you know, ${sisterName} 🥹❤️`,
      animationType: "emotional",
    };
  }

  // Multiple Choice Specific Checks
  if (ansLower.includes("joke") || ansLower.includes("funny") || ansLower.includes("laugh")) {
    return {
      responseMessage: `I knew my terrible jokes would win! 😂❤️`,
      animationType: "funny_shake",
    };
  }

  if (ansLower.includes("caring") || ansLower.includes("kind") || ansLower.includes("protect") || ansLower.includes("help")) {
    return {
      responseMessage: `Aww, so you actually notice all the little things I do 🥹❤️`,
      animationType: "emotional",
    };
  }

  if (ansLower.includes("intelligent") || ansLower.includes("smart") || ansLower.includes("brain")) {
    return {
      responseMessage: `Finally! Someone in the family acknowledges my genius! 🧠✨`,
      animationType: "celebration",
    };
  }

  if (ansLower.includes("everything") || ansLower.includes("all") || ansLower.includes("both")) {
    return {
      responseMessage: `Aww, 10/10 best answer! That's why you're my favorite sister 🌸❤️`,
      animationType: "celebration",
    };
  }

  return {
    responseMessage: `I knew you'd pick that, ${sisterName}! Always bringing a smile! 🌸✨`,
    animationType: "confetti",
  };
}

export async function generateAIExperienceSummary(
  sisterName: string,
  qaList: { question: string; answer: string }[]
): Promise<AIExperienceSummaryResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== "") {
    const modelNames = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"];

    for (const modelName of modelNames) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const qaText = qaList.map((item, i) => `${i + 1}. Q: ${item.question} -> A: ${item.answer}`).join("\n");

        const prompt = `
You are a loving brother on Raksha Bandhan transitioning to the final handwritten letter for your sister ${sisterName}.
She just answered these interactive questions:
${qaText}

Task:
Write a heartfelt 2-3 sentence AI summary reflection acknowledging her answers, celebrating your sibling bond, and inviting her to unfold her final letter.

Respond ONLY in raw JSON format:
{
  "title": "Short warm title with emoji (e.g. Our Unbreakable Bond ❤️)",
  "summaryMessage": "2-3 heartfelt sentences synthesizing her answers and leading into the final letter."
}
`;

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned) as AIExperienceSummaryResult;

        if (parsed.title && parsed.summaryMessage) {
          return parsed;
        }
      } catch {
        continue;
      }
    }
  }

  // Fallback summary
  return fallbackExperienceSummary(sisterName, qaList);
}

function fallbackExperienceSummary(
  sisterName: string,
  qaList: { question: string; answer: string }[]
): AIExperienceSummaryResult {
  return {
    title: `You & Me: An Unbreakable Bond ❤️`,
    summaryMessage: `Looking at all your answers, ${sisterName}, it reminds me how blessed I am to have you as my sister. Through all our laughs, silly fights, and shared moments, our bond only grows stronger. Now, I have written one last surprise straight from my heart...`,
  };
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
