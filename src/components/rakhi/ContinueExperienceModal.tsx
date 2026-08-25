"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, ChevronRight, Wand2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { sfx } from "@/lib/sfx";

interface ContinueExperienceModalProps {
  title?: string;
  summaryMessage: string;
  isLoading?: boolean;
  onContinue: () => void;
}

export default function ContinueExperienceModal({
  title = "Our Sibling Story So Far ❤️",
  summaryMessage,
  isLoading = false,
  onContinue,
}: ContinueExperienceModalProps) {
  useEffect(() => {
    sfx.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
      colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FBBF24", "#FFFFFF"],
    });
  }, []);

  const handleButtonClick = () => {
    sfx.playChime();
    onContinue();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-950/60 backdrop-blur-md select-none touch-manipulation"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative max-w-lg w-full bg-white/95 border-2 border-rose-200/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl text-gray-900 will-change-transform"
        >
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-300 text-[#E07A5F] text-xs font-black tracking-widest uppercase shadow-xs">
            <Wand2 className="w-3.5 h-3.5 text-[#E07A5F] animate-pulse" />
            <span>AI Sibling Reflection ✨</span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
              {title}
            </h3>
            <div className="w-12 h-1 bg-gradient-to-r from-[#E07A5F] to-[#D97706] rounded-full mx-auto" />
          </div>

          {/* AI Generated Reflection Text Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FEF3C7]/60 border border-amber-300/80 shadow-inner text-left">
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider">
                  Analyzing all your answers with AI... ✨
                </span>
              </div>
            ) : (
              <p className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed font-bold whitespace-pre-wrap">
                &ldquo;{summaryMessage}&rdquo;
              </p>
            )}
          </div>

          {/* Glowing Continue Button */}
          <motion.button
            type="button"
            onClick={handleButtonClick}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="w-full py-4 rounded-2xl text-white font-serif font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-200/60 border border-rose-200 flex items-center justify-center gap-2 cursor-pointer active:scale-96 transition-all"
          >
            <span>CONTINUE TO FINAL LETTER 📜</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
