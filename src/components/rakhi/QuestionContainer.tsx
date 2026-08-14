"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronDown } from "lucide-react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import YesNoQuestion from "./questions/YesNoQuestion";
import EmojiQuestion from "./questions/EmojiQuestion";
import TextQuestion from "./questions/TextQuestion";
import RatingQuestion from "./questions/RatingQuestion";
import ImageChoiceQuestion from "./questions/ImageChoiceQuestion";
import ReactionOverlay from "./ReactionOverlay";
import MemoryRevealModal from "./MemoryRevealModal";

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
  const [displayedText, setDisplayedText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [activeReaction, setActiveReaction] = useState<{
    message?: string | null;
    animationType?: string | null;
  } | null>(null);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!questions || questions.length === 0) {
      onCompleteAll();
      return;
    }
    if (!currentQ) return;
    setDisplayedText("");
    setShowOptions(false);

    let charIdx = 0;
    const fullText = currentQ.question;

    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowOptions(true), 300);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [currentIndex, currentQ]);

  if (!currentQ) return null;

  const handleAnswerSelect = async (optionId: string, answerValue: string) => {
    const option = currentQ.options.find((o) => o.id === optionId || o.value === answerValue);

    try {
      await fetch("/api/rakhi/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQ.id,
          answer: answerValue,
          optionId: option?.id || null,
        }),
      });
    } catch (e) {
      console.error("Failed to save answer:", e);
    }

    if (option && (option.responseMessage || option.animationType)) {
      setActiveReaction({
        message: option.responseMessage,
        animationType: option.animationType || "confetti",
      });
    } else {
      advanceNext(option);
    }
  };

  const handleReactionDone = () => {
    const option = currentQ.options.find(
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
      onCompleteAll();
    }
  };

  const renderQuestionOptions = () => {
    switch (currentQ.type) {
      case "multiple_choice":
        return (
          <MultipleChoiceQuestion options={currentQ.options} onSelect={handleAnswerSelect} />
        );
      case "yes_no":
        return <YesNoQuestion options={currentQ.options} onSelect={handleAnswerSelect} />;
      case "emoji":
        return <EmojiQuestion options={currentQ.options} onSelect={handleAnswerSelect} />;
      case "text":
        return (
          <TextQuestion
            optionId={currentQ.options[0]?.id}
            onSelect={handleAnswerSelect}
          />
        );
      case "rating":
        return (
          <RatingQuestion
            optionId={currentQ.options[0]?.id}
            onSelect={handleAnswerSelect}
          />
        );
      case "image_choice":
        return (
          <ImageChoiceQuestion
            memories={memories}
            onSelect={(memId, caption) => handleAnswerSelect(memId, caption)}
          />
        );
      default:
        return (
          <MultipleChoiceQuestion options={currentQ.options} onSelect={handleAnswerSelect} />
        );
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900">
      {/* Reaction Overlay */}
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

      {/* Progress Dots Bar */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-rose-200 shadow-md">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-7 bg-[#E07A5F] shadow-sm"
                : i < currentIndex
                ? "w-2.5 bg-[#E07A5F]/70"
                : "w-2.5 bg-rose-200"
            }`}
          />
        ))}
      </div>

      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm sm:max-w-xl bg-white/95 border-2 border-rose-200/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-10 space-y-6 shadow-[0_20px_50px_rgba(224,122,95,0.15)] my-10"
      >
        {/* Header Question Counter */}
        <div className="text-xs uppercase tracking-widest font-black text-[#E07A5F] px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 inline-block shadow-sm">
          QUESTION {String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
        </div>

        {/* Question Text with Typewriter effect */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 min-h-[70px] flex items-center justify-center leading-snug drop-shadow-sm px-2">
          {displayedText}
          <span className="inline-block w-1.5 h-7 bg-[#E07A5F] ml-1 animate-pulse" />
        </h2>

        {/* Options */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-2 space-y-4"
            >
              {renderQuestionOptions()}

              {/* Comforting Reassurance Badge */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 py-2.5 px-4 rounded-xl shadow-sm mt-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Don&apos;t worry! Your answers are kept completely private and safe. ❤️</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
