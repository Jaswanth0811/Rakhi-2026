"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Sparkles, Heart, Volume2, ChevronRight, Lock, Stamp } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface FinalLetterProps {
  sisterName: string;
  photoUrl?: string | null;
  finalMessage: string;
  onNext: () => void;
}

type LetterState = "sealed" | "breaking_seal" | "unfolding" | "reading";

export default function FinalLetter({
  sisterName,
  photoUrl,
  finalMessage,
  onNext,
}: FinalLetterProps) {
  const [letterState, setLetterState] = useState<LetterState>("sealed");
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(1);

  const paragraphs = finalMessage
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  const handleBreakSeal = () => {
    sfx.playToyPop();
    setLetterState("breaking_seal");

    setTimeout(() => {
      sfx.playFanfare();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FFFFFF", "#F59E0B"],
      });
      setLetterState("unfolding");

      setTimeout(() => {
        setLetterState("reading");
      }, 1000);
    }, 600);
  };

  const handleContinueToCeremony = () => {
    sfx.playChime();
    onNext();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900">
      {/* Ambient background glow */}
      <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-pink-200/50 blur-[140px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* STAGE 1: SEALED PHYSICAL ENVELOPE SCENE */}
        {letterState === "sealed" || letterState === "breaking_seal" ? (
          <motion.div
            key="sealed-envelope-scene"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 border-2 border-rose-200/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(224,122,95,0.2)] text-center flex flex-col items-center"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-[#D97706] text-xs font-extrabold tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>One Last Surprise...</span>
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                A Handwritten Letter For <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#D97706]">
                  {sisterName} ❤️
                </span>
              </h2>
              <p className="text-xs text-gray-600 font-bold">
                Tap the red wax seal below to break the seal and unfold your letter.
              </p>
            </div>

            {/* PHYSICAL ENVELOPE CARD WITH WAX SEAL */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border-2 border-amber-300/80 p-4 shadow-inner flex flex-col items-center justify-center overflow-hidden my-2">
              {/* Envelope Flap Triangles */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-amber-200/60 border-b border-amber-300/60 shadow-xs rounded-b-2xl pointer-events-none" />

              {/* INTERACTIVE WAX SEAL BUTTON */}
              <motion.button
                type="button"
                onClick={handleBreakSeal}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={
                  letterState === "breaking_seal"
                    ? { scale: [1, 1.2, 0.9, 1.1, 0], rotate: [0, -10, 10, -5, 0] }
                    : {}
                }
                transition={{ duration: 0.6 }}
                className="relative z-20 p-5 rounded-full bg-gradient-to-tr from-[#991B1B] via-[#DC2626] to-[#7F1D1D] border-4 border-amber-100 shadow-[0_10px_30px_rgba(153,27,27,0.5)] cursor-pointer group flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 flex items-center justify-center text-amber-200">
                  <Stamp className="w-7 h-7 animate-pulse" />
                </div>
                <span className="absolute -bottom-3 text-[9px] font-black uppercase tracking-widest text-amber-950 bg-amber-200 px-3 py-0.5 rounded-full border border-amber-400 whitespace-nowrap shadow-md">
                  TOUCH WAX SEAL 🏷️
                </span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* STAGE 2: UNFOLDED IVORY PARCHMENT LETTER */
          <motion.div
            key="unfolded-letter-scene"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl bg-[#FFFBEB]/95 border-2 border-amber-300/90 backdrop-blur-3xl rounded-3xl p-5 sm:p-8 space-y-5 shadow-[0_25px_60px_rgba(217,119,6,0.2)] text-left my-4"
          >
            {/* Top Bar with Sister Photo & Audio Equalizer */}
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm bg-white shrink-0">
                  {photoUrl ? (
                    <Image src={photoUrl} alt={sisterName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-amber-800 text-lg">
                      {sisterName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                    To My Sister, {sisterName}
                  </h3>
                  <span className="text-[10px] text-amber-800 uppercase tracking-widest font-black flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Dedicated Letter
                  </span>
                </div>
              </div>

              {/* Audio Equalizer Pill */}
              <div className="flex items-center gap-1.5 bg-amber-100/90 border border-amber-300 px-3 py-1.5 rounded-full text-xs text-amber-900 font-bold shadow-xs">
                <Volume2 className="w-3.5 h-3.5 text-[#E07A5F] animate-pulse" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-[#E07A5F] animate-[bounce_1s_infinite_100ms] h-full" />
                  <span className="w-0.5 bg-[#E07A5F] animate-[bounce_1s_infinite_300ms] h-2/3" />
                  <span className="w-0.5 bg-[#E07A5F] animate-[bounce_1s_infinite_200ms] h-4/5" />
                </div>
              </div>
            </div>

            {/* Parchment Body with Progressive Readable Paragraphs */}
            <div className="relative p-5 sm:p-7 rounded-2xl bg-[#FEF3C7]/50 border border-amber-200/90 shadow-inner max-h-[55vh] overflow-y-auto custom-scrollbar space-y-4">
              {paragraphs.map((paragraph, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.3 }}
                  className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed font-bold whitespace-pre-wrap selection:bg-rose-200"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Emotional Reading Pause & Proceed Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: paragraphs.length * 0.3 + 0.4 }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <span className="text-xs text-amber-900 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" /> Next: Virtual Rakhi Ceremony
              </span>

              <motion.button
                onClick={handleContinueToCeremony}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
                }}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl text-white font-black tracking-widest text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
              >
                <span>PROCEED TO VIRTUAL RAKHI CEREMONY 🏵️</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
