"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Smile, PartyPopper } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface ReactionOverlayProps {
  message?: string | null;
  animationType?: string | null;
  onDone: () => void;
}

export default function ReactionOverlay({
  message,
  animationType = "confetti",
  onDone,
}: ReactionOverlayProps) {
  useEffect(() => {
    sfx.playChime();

    if (
      animationType === "confetti" ||
      animationType === "celebration" ||
      animationType === "happy"
    ) {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.55 },
        colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FBBF24"],
      });
    }

    // Auto-advance Response Message in 1.6s or tap anytime
    const timer = setTimeout(() => {
      onDone();
    }, 1600);

    return () => clearTimeout(timer);
  }, [animationType, onDone]);

  const renderIcon = () => {
    switch (animationType) {
      case "funny_shake":
        return <Smile className="w-10 h-10 text-[#E07A5F] animate-bounce" />;
      case "emotional":
        return <Heart className="w-10 h-10 text-rose-500 animate-pulse" />;
      case "celebration":
      case "confetti":
        return <PartyPopper className="w-10 h-10 text-[#D97706] animate-bounce" />;
      default:
        return <Sparkles className="w-10 h-10 text-[#E07A5F] animate-spin" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        onClick={onDone}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-950/50 backdrop-blur-sm cursor-pointer select-none touch-manipulation"
      >
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative max-w-sm w-full bg-white/95 border-2 border-rose-200 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-4 text-center shadow-2xl text-gray-900"
        >
          <div className="p-4 rounded-full bg-rose-50 border border-rose-200 w-16 h-16 mx-auto flex items-center justify-center shadow-xs">
            {renderIcon()}
          </div>

          {message && (
            <p className="font-serif text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              &ldquo;{message}&rdquo;
            </p>
          )}

          <div className="pt-1 text-[10px] text-gray-700 font-extrabold uppercase tracking-widest animate-pulse">
            Tap anywhere to continue ⏩
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
