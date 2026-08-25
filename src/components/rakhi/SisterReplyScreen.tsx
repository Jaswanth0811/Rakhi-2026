"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Send, SkipForward, Heart, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface SisterReplyScreenProps {
  sisterName: string;
  onNext: () => void;
}

const PRESET_MESSAGES = [
  "You are the best brother ever! 🏆❤️",
  "Thank you for this beautiful surprise! 🥹✨",
  "I will cherish this forever! 🌸",
  "Happy Raksha Bandhan Brother! 🏵️",
  "Love you so much! 🤗💖",
];

export default function SisterReplyScreen({ sisterName, onNext }: SisterReplyScreenProps) {
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSelectPreset = (preset: string) => {
    sfx.playPop();
    setReplyText((prev) => (prev ? `${prev} ${preset}` : preset));
  };

  const handleSendReply = async () => {
    if (isSending) return;
    sfx.playToyPop();
    setIsSending(true);

    try {
      if (replyText.trim()) {
        await fetch("/api/rakhi/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: replyText.trim() }),
        });
      }

      sfx.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FFFFFF", "#F59E0B"],
      });

      setSentSuccess(true);
      setTimeout(() => {
        onNext();
      }, 900);
    } catch {
      onNext();
    }
  };

  const handleSkip = () => {
    sfx.playChime();
    onNext();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900 select-none touch-manipulation">
      {/* Ambient background glow */}
      <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-rose-200/50 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 border-2 border-rose-200/90 backdrop-blur-3xl rounded-3xl p-5 sm:p-7 space-y-5 shadow-[0_25px_60px_rgba(224,122,95,0.18)] text-center flex flex-col items-center text-gray-900 will-change-transform"
      >
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-[#E07A5F] text-xs font-black tracking-widest uppercase shadow-xs">
          <MessageCircle className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Say Something Back ❤️</span>
        </div>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900">
            A Message For Your Brother 💌
          </h2>
          <p className="text-xs text-gray-600 font-bold">
            Leave a note or sweet message for him, or skip to the Rakhi ceremony.
          </p>
        </div>

        {/* Quick Presets Pill Selector */}
        <div className="w-full space-y-2 text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#E07A5F]" /> Quick Message Ideas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_MESSAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[#E07A5F] text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Reply Textarea */}
        <div className="w-full relative">
          <textarea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Type your reply to your brother here, ${sisterName}... ❤️`}
            className="w-full p-4 rounded-2xl bg-rose-50/60 border-2 border-rose-200/90 text-gray-900 font-sans text-sm font-bold placeholder-gray-400 focus:outline-none focus:border-[#E07A5F] focus:bg-white transition-all shadow-inner resize-none"
          />
        </div>

        {/* Action Buttons: Send Message vs Skip */}
        <div className="w-full space-y-2.5 pt-1">
          <motion.button
            type="button"
            onClick={handleSendReply}
            disabled={isSending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="w-full py-4 rounded-2xl text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-rose-200/60 border border-rose-200 flex items-center justify-center gap-2 cursor-pointer active:scale-96 transition-all"
          >
            {sentSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                <span>SENT TO YOUR BROTHER! ❤️</span>
              </>
            ) : isSending ? (
              <span>SENDING YOUR MESSAGE... ⏳</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>SEND MESSAGE TO BROTHER 💌</span>
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-3 rounded-xl bg-transparent hover:bg-rose-50 border border-transparent hover:border-rose-200 text-gray-700 hover:text-gray-900 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <span>Skip To Virtual Rakhi Ceremony</span>
            <SkipForward className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
