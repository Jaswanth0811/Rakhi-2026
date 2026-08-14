"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Smile, PartyPopper } from "lucide-react";

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
    if (
      animationType === "confetti" ||
      animationType === "celebration" ||
      animationType === "happy"
    ) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FBBF24"],
      });
    }

    const timer = setTimeout(() => {
      onDone();
    }, 2800);

    return () => clearTimeout(timer);
  }, [animationType, onDone]);

  const renderIcon = () => {
    switch (animationType) {
      case "funny_shake":
        return <Smile className="w-12 h-12 text-[#E07A5F] animate-bounce" />;
      case "emotional":
        return <Heart className="w-12 h-12 text-rose-500 animate-pulse" />;
      case "celebration":
      case "confetti":
        return <PartyPopper className="w-12 h-12 text-[#D97706] animate-bounce" />;
      default:
        return <Sparkles className="w-12 h-12 text-[#E07A5F] animate-spin" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-950/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="max-w-sm w-full bg-white border-2 border-rose-200 rounded-3xl p-8 text-center space-y-4 shadow-2xl"
        >
          <div className="flex justify-center">{renderIcon()}</div>
          {message && (
            <p className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {message}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
