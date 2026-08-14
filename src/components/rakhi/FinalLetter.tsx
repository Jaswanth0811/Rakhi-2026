"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Sparkles, Heart, Volume2, ChevronDown } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface FinalLetterProps {
  sisterName: string;
  photoUrl?: string | null;
  finalMessage: string;
  onNext: () => void;
}

export default function FinalLetter({
  sisterName,
  photoUrl,
  finalMessage,
  onNext,
}: FinalLetterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLetter = () => {
    sfx.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FFFFFF", "#F59E0B"],
    });
    setIsOpen(true);
  };

  const handleContinue = () => {
    sfx.playChime();
    onNext();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900">
      {/* Light Theme Background ambient glow */}
      <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-pink-200/50 blur-[140px] pointer-events-none" />

      {!isOpen ? (
        /* Luxury Physical Wax-Seal Digital Envelope Screen (Light Theme) */
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 border-2 border-rose-200/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(224,122,95,0.15)] text-center"
        >
          {/* Wax Seal Container */}
          <div className="flex justify-center my-2">
            <motion.button
              type="button"
              onClick={handleOpenLetter}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="relative p-6 rounded-full bg-gradient-to-tr from-[#E07A5F] via-[#F4ACB7] to-[#D97706] border-4 border-white shadow-[0_0_25px_rgba(224,122,95,0.4)] cursor-pointer group"
            >
              <div className="w-12 h-12 flex items-center justify-center text-white">
                <Sparkles className="w-8 h-8 animate-glow" />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase tracking-widest text-[#E07A5F] bg-white px-2.5 py-0.5 rounded-full border border-rose-200 whitespace-nowrap shadow-md">
                TAP SEAL TO UNBOX
              </span>
            </motion.button>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 drop-shadow-sm">
              A Personal Letter For <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#D97706]">
                {sisterName}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-800 font-bold leading-relaxed bg-rose-50/80 p-4 rounded-2xl border border-rose-200 shadow-inner">
              Written straight from the heart. Tap the wax seal above to break the seal and read your letter. ❤️
            </p>
          </div>

          <motion.button
            onClick={handleOpenLetter}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="w-full py-4 rounded-2xl text-white font-black tracking-widest text-sm sm:text-base shadow-lg shadow-rose-200 transition-all cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>OPEN MY LETTER</span>
          </motion.button>
        </motion.div>
      ) : (
        /* Opened Digital Letter Screen (Light Parchment Theme with Dark Text) */
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl bg-[#FFFBEB]/95 border-2 border-amber-200/90 backdrop-blur-3xl rounded-3xl p-5 sm:p-8 space-y-5 shadow-[0_20px_50px_rgba(217,119,6,0.15)] text-left my-6"
          >
            {/* Top Bar with Sister Photo & Audio Wave Equalizer */}
            <div className="flex items-center justify-between border-b border-amber-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 shadow-sm bg-white shrink-0">
                  {photoUrl ? (
                    <Image src={photoUrl} alt={sisterName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-amber-700 text-lg">
                      {sisterName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                    To My Sister, {sisterName}
                  </h3>
                  <span className="text-[10px] text-amber-800 uppercase tracking-widest font-extrabold flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Dedicated Letter
                  </span>
                </div>
              </div>

              {/* Animated Sound Equalizer Pill */}
              <div className="flex items-center gap-1 bg-amber-100/90 border border-amber-300 px-3 py-1.5 rounded-full text-xs text-amber-900 font-bold shadow-xs">
                <Volume2 className="w-3.5 h-3.5 text-[#E07A5F] animate-pulse" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-[#E07A5F] animate-[bounce_1s_infinite_100ms] h-full" />
                  <span className="w-0.5 bg-[#E07A5F] animate-[bounce_1s_infinite_300ms] h-2/3" />
                  <span className="w-0.5 bg-[#E07A5F] animate-[bounce_1s_infinite_200ms] h-4/5" />
                </div>
              </div>
            </div>

            {/* Parchment Letter Body with Crisp 100% Legible Dark Text */}
            <div className="relative p-5 sm:p-7 rounded-2xl bg-[#FEF3C7]/40 border border-amber-200 shadow-inner max-h-[55vh] overflow-y-auto custom-scrollbar space-y-4">
              <p className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed font-bold whitespace-pre-wrap selection:bg-rose-200">
                {finalMessage}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-amber-900 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" /> Next: Virtual Rakhi Ceremony
              </span>

              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
                }}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl text-white font-black tracking-widest text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
              >
                <span>CONTINUE TO RAKHI REVEAL</span>
                <ChevronDown className="w-4 h-4 text-white -rotate-90" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
