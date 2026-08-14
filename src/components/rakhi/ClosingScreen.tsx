"use client";

import { motion } from "framer-motion";
import { RotateCcw, Mail, Heart } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface ClosingScreenProps {
  sisterName: string;
  onReplay: () => void;
  onViewLetter: () => void;
}

export default function ClosingScreen({ sisterName, onReplay, onViewLetter }: ClosingScreenProps) {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900">
      {/* Soft background light */}
      <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-pink-200/50 blur-[130px] pointer-events-none animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 border-2 border-rose-200/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(224,122,95,0.15)]"
      >
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-rose-50 border-2 border-rose-300 text-[#E07A5F] shadow-sm">
            <Heart className="w-8 h-8 fill-[#E07A5F] animate-pulse text-[#E07A5F]" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 drop-shadow-sm">
            Thank you for being <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#D97706] italic">
              the best sister ever.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-800 font-bold bg-rose-50/80 p-4 rounded-2xl border border-rose-200 shadow-inner">
            Happy Raksha Bandhan, {sisterName}! ❤️
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <motion.button
            onClick={() => {
              sfx.playChime();
              onViewLetter();
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="w-full py-4 rounded-2xl text-white font-black tracking-widest text-xs sm:text-sm shadow-lg shadow-rose-200 cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
          >
            <Mail className="w-4 h-4 text-white" />
            <span>READ YOUR LETTER AGAIN</span>
          </motion.button>

          <motion.button
            onClick={() => {
              sfx.playPop();
              onReplay();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full py-3.5 rounded-2xl bg-white border-2 border-rose-300 text-[#E07A5F] font-extrabold tracking-wider text-xs sm:text-sm hover:border-[#E07A5F] hover:bg-rose-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-[#E07A5F]" />
            <span>REPLAY EXPERIENCE</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
