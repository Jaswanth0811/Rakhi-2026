"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, ChevronDown } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface CinematicUnlockProps {
  sisterName: string;
  onNext: () => void;
}

export default function CinematicUnlock({ sisterName, onNext }: CinematicUnlockProps) {
  const handleBegin = () => {
    sfx.playChime();
    onNext();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900">
      {/* Light Theme Background Animated Glows */}
      <div className="absolute w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full bg-gradient-to-tr from-pink-200/50 via-rose-200/40 to-amber-200/30 blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Decorative Rakhi Thread SVG Animation */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="w-full max-w-xs sm:max-w-sm h-1 my-4 relative overflow-hidden rounded-full"
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#E07A5F] to-transparent shadow-[0_0_15px_#E07A5F]" />
      </motion.div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 max-w-md w-full space-y-6 bg-white/95 border-2 border-rose-200/80 backdrop-blur-3xl p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(224,122,95,0.15)] flex flex-col items-center"
      >
        {/* Unlocked Badge */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-[#E07A5F] text-xs font-extrabold tracking-widest uppercase shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F] animate-bounce" />
          <span>Unlocked For You</span>
        </motion.div>

        {/* Sister Title */}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 drop-shadow-sm leading-tight">
          Hey, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] via-[#F4ACB7] to-[#D97706] italic">
            {sisterName}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg text-gray-800 font-bold max-w-sm mx-auto leading-relaxed bg-rose-50/80 p-4 rounded-2xl border border-rose-200 shadow-inner"
        >
          I crafted something deeply personal, interactive, and special just for you. ❤️
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="pt-2 w-full space-y-3"
        >
          <motion.button
            onClick={handleBegin}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="w-full py-4 px-8 rounded-2xl text-white font-black tracking-widest text-base shadow-lg shadow-rose-200 cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
          >
            <span>LET&apos;S BEGIN</span>
            <Heart className="w-4 h-4 text-white fill-white" />
          </motion.button>

          {/* Mobile Scroll Indicator Hint */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 pt-2 animate-bounce">
            <span>Scroll down or tap to proceed</span>
            <ChevronDown className="w-4 h-4 text-[#E07A5F]" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
