"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import YesNoQuestion from "./questions/YesNoQuestion";
import EmojiQuestion from "./questions/EmojiQuestion";
import TextQuestion from "./questions/TextQuestion";
import RatingQuestion from "./questions/RatingQuestion";
import ImageChoiceQuestion from "./questions/ImageChoiceQuestion";
import ReactionOverlay from "./ReactionOverlay";
import { sfx } from "@/lib/sfx";

interface Memory {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface Option {
  id: string;
  label: string;
  value: string;
  responseMessage?: string | null;
  animationType?: string | null;
  nextQuestionId?: string | null;
  memoryId?: string | null;
  memory?: Memory | null;
}

interface QuestionData {
  id: string;
  question: string;
  type: string;
  displayOrder: number;
  options: Option[];
}

interface QuestionContainerProps {
  questions: QuestionData[];
  memories: Memory[];
  onCompleteAll: () => void;
}

interface RecentHistoryItem {
  question: string;
  answer: string;
}

export default function QuestionContainer({
  questions,
  memories,
  onCompleteAll,
}: QuestionContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentHistory, setRecentHistory] = useState<RecentHistoryItem[]>([]);
  const [activeReaction, setActiveReaction] = useState<{
    message?: string | null;
    animationType?: string | null;
    nextQuestionId?: string | null;
  } | null>(null);

  const isAnsweringRef = useRef(false);
  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!questions || questions.length === 0) {
      onCompleteAll();
    }
  }, [questions, onCompleteAll]);

  if (!currentQ) return null;

  const handleAnswerSelect = async (optionId: string, answerValue: string) => {
    if (isAnsweringRef.current) return;
    isAnsweringRef.current = true;
    setIsSubmitting(true);
    sfx.playPop();

    const option = currentQ.options?.find(
      (o) => o.id === optionId || o.value === answerValue || o.label === answerValue
    );

    // If ImageChoice, find memory caption
    const selectedMemory = memories.find((m) => m.id === optionId || m.caption === answerValue);
    const photoContext = selectedMemory?.caption || option?.memory?.caption || null;

    // Fast fallback reaction generator if network is slow/offline
    const getFastFallbackReaction = () => {
      const ansLower = (answerValue || "").toLowerCase();
      const qLower = currentQ.question.toLowerCase();

      if (currentQ.type === "image_choice" || photoContext) {
        return {
          responseMessage: "Aww, you chose this memory! 🥹❤️ Some moments never get old.",
          animationType: "emotional",
        };
      }
      if (currentQ.type === "yes_no" || ansLower === "yes" || ansLower === "no") {
        if (ansLower.includes("yes")) {
          return {
            responseMessage: "I knew you had good taste! 😌❤️",
            animationType: "celebration",
          };
        }
        return {
          responseMessage: "WHAT?! 😭 Okay, we are definitely holding a sibling meeting! 😂",
          animationType: "funny_shake",
        };
      }
      if (currentQ.type === "rating" || !isNaN(Number(answerValue))) {
        const num = Number(answerValue);
        if (qLower.includes("annoy")) {
          return {
            responseMessage: `${num}/10?! You really had zero mercy on me 😭😂`,
            animationType: "funny_shake",
          };
        }
        return {
          responseMessage: `Saving this ${num}/10 rating forever! No take-backs ❤️🌟`,
          animationType: "celebration",
        };
      }
      if (currentQ.type === "emoji") {
        if (ansLower.includes("🥹") || ansLower.includes("❤️") || ansLower.includes("🥰")) {
          return {
            responseMessage: "Okay... that one emoji says way more than words ever could 🥹❤️",
            animationType: "emotional",
          };
        }
        return {
          responseMessage: "Yep. That emoji basically summarizes our entire relationship 😂❤️",
          animationType: "funny_shake",
        };
      }
      if (currentQ.type === "text") {
        return {
          responseMessage: "Reading this means more to me than you know 🥹❤️",
          animationType: "emotional",
        };
      }
      return {
        responseMessage: "I knew you'd pick that! Always bringing a smile! 🌸✨",
        animationType: "confetti",
      };
    };

    try {
      // Create controller with 1.8s timeout race for instant UI feel
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);

      const res = await fetch("/api/rakhi/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          questionId: currentQ.id,
          answer: answerValue,
          optionId: option?.id || null,
          photoContext,
          recentHistory: recentHistory.slice(-4),
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const reaction = data.reaction || getFastFallbackReaction();
        setActiveReaction({
          message: reaction.responseMessage,
          animationType: reaction.animationType || "confetti",
          nextQuestionId: reaction.nextQuestionId || option?.nextQuestionId || null,
        });
      } else {
        const fallback = getFastFallbackReaction();
        setActiveReaction({
          message: fallback.responseMessage,
          animationType: fallback.animationType,
          nextQuestionId: option?.nextQuestionId || null,
        });
      }
    } catch {
      // Abort or network error: use instantaneous smart fallback
      const fallback = getFastFallbackReaction();
      setActiveReaction({
        message: fallback.responseMessage,
        animationType: fallback.animationType,
        nextQuestionId: option?.nextQuestionId || null,
      });
    } finally {
      // Update session history
      setRecentHistory((prev) => [
        ...prev,
        { question: currentQ.question, answer: answerValue },
      ]);
      setIsSubmitting(false);
    }
  };

  const handleReactionDone = () => {
    const nextQId = activeReaction?.nextQuestionId;
    setActiveReaction(null);
    isAnsweringRef.current = false;
    advanceNext(nextQId);
  };

  const advanceNext = (nextQuestionId?: string | null) => {
    if (nextQuestionId) {
      const nextIdx = questions.findIndex((q) => q.id === nextQuestionId);
      if (nextIdx !== -1) {
        setCurrentIndex(nextIdx);
        return;
      }
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Complete questionnaire and open Final Letter
      onCompleteAll();
    }
  };

  const renderQuestionComponent = () => {
    if (!currentQ) return null;
    switch (currentQ.type) {
      case "yes_no":
        return (
          <YesNoQuestion
            options={currentQ.options}
            onSelect={handleAnswerSelect}
          />
        );
      case "emoji":
        return (
          <EmojiQuestion
            options={currentQ.options}
            onSelect={handleAnswerSelect}
          />
        );
      case "text":
        return (
          <TextQuestion
            optionId={currentQ.options[0]?.id || "text_input"}
            onSelect={handleAnswerSelect}
          />
        );
      case "rating":
        return (
          <RatingQuestion
            optionId={currentQ.options[0]?.id || "rating_input"}
            onSelect={handleAnswerSelect}
          />
        );
      case "image_choice":
        return (
          <ImageChoiceQuestion
            memories={memories}
            onSelect={handleAnswerSelect}
          />
        );
      case "multiple_choice":
      default:
        return (
          <MultipleChoiceQuestion
            options={currentQ.options}
            onSelect={handleAnswerSelect}
          />
        );
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900 select-none touch-manipulation">
      {/* Ambient Glow */}
      <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-rose-200/50 blur-[130px] pointer-events-none" />

      {/* Main Question Card Container */}
      <div className="relative z-10 w-full max-w-lg sm:max-w-xl flex flex-col items-center space-y-6">
        {/* Progress Counter Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-rose-200/90 shadow-xs text-xs font-black uppercase text-[#E07A5F] tracking-widest backdrop-blur-xl"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </motion.div>

        {/* Dynamic Question Card with Instant Text & Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full bg-white/95 border-2 border-rose-200/90 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(224,122,95,0.18)] text-gray-900 text-center will-change-transform"
          >
            {/* Question Text */}
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug tracking-tight">
              {currentQ.question}
            </h2>

            {/* Answer Options Component */}
            <div className={`w-full pt-2 ${isSubmitting ? "pointer-events-none opacity-80" : ""}`}>
              {renderQuestionComponent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reaction Overlay Modal displaying AI Response Message */}
      {activeReaction && (
        <ReactionOverlay
          message={activeReaction.message}
          animationType={activeReaction.animationType}
          onDone={handleReactionDone}
        />
      )}
    </div>
  );
}
