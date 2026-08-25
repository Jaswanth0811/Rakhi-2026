"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import YesNoQuestion from "./questions/YesNoQuestion";
import EmojiQuestion from "./questions/EmojiQuestion";
import TextQuestion from "./questions/TextQuestion";
import RatingQuestion from "./questions/RatingQuestion";
import ImageChoiceQuestion from "./questions/ImageChoiceQuestion";
import ReactionOverlay from "./ReactionOverlay";
import MemoryRevealModal from "./MemoryRevealModal";
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

export default function QuestionContainer({
  questions,
  memories,
  onCompleteAll,
}: QuestionContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeReaction, setActiveReaction] = useState<{
    message?: string | null;
    animationType?: string | null;
  } | null>(null);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!questions || questions.length === 0) {
      onCompleteAll();
    }
  }, [questions, onCompleteAll]);

  if (!currentQ) return null;

  const handleAnswerSelect = (optionId: string, answerValue: string) => {
    sfx.playPop();
    const option = currentQ.options?.find((o) => o.id === optionId || o.value === answerValue);

    // Save answer in background without blocking or re-triggering UI state
    fetch("/api/rakhi/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: currentQ.id,
        answer: answerValue,
        optionId: option?.id || null,
      }),
    }).catch((e) => console.error("Async answer save error:", e));

    // If this option has a specific custom response message / animation, show it once
    if (option && (option.responseMessage || option.animationType)) {
      setActiveReaction({
        message: option.responseMessage,
        animationType: option.animationType || "confetti",
      });
    } else if (option?.memory) {
      setActiveMemory(option.memory);
    } else {
      // Advance to next question immediately
      advanceNext(option);
    }
  };

  const handleReactionDone = () => {
    const option = currentQ?.options?.find(
      (o) => o.responseMessage === activeReaction?.message
    );
    setActiveReaction(null);

    if (option?.memory) {
      setActiveMemory(option.memory);
    } else {
      advanceNext(option);
    }
  };

  const handleMemoryDone = () => {
    setActiveMemory(null);
    advanceNext();
  };

  const advanceNext = (option?: Option | null) => {
    if (option?.nextQuestionId) {
      const nextIdx = questions.findIndex((q) => q.id === option.nextQuestionId);
      if (nextIdx !== -1) {
        setCurrentIndex(nextIdx);
        return;
      }
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Directly complete questions and open Final Letter
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
            <div className="w-full pt-2">
              {renderQuestionComponent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reaction Overlay Modal */}
      {activeReaction && (
        <ReactionOverlay
          message={activeReaction.message}
          animationType={activeReaction.animationType}
          onDone={handleReactionDone}
        />
      )}

      {/* Memory Reveal Modal */}
      {activeMemory && (
        <MemoryRevealModal
          imageUrl={activeMemory.imageUrl}
          caption={activeMemory.caption}
          onClose={handleMemoryDone}
        />
      )}
    </div>
  );
}
