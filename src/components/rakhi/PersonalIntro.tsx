"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Heart, ChevronDown } from "lucide-react";

interface PersonalIntroProps {
  sisterName: string;
  photoUrl?: string | null;
  onNext: () => void;
}

export default function PersonalIntro({ sisterName, photoUrl, onNext }: PersonalIntroProps) {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900">
      {/* Light Theme Glow background */}
      <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-pink-200/50 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 border-2 border-rose-200/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(224,122,95,0.15)]"
      >
        {/* Photo Container with Blur-to-Sharp reveal & Light Glowing Ring */}
        {photoUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: "blur(15px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#E07A5F] via-[#F4ACB7] to-[#D97706] shadow-xl shadow-rose-200"
          >
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
              <Image
                src={photoUrl}
                alt={sisterName}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
          </motion.div>
        ) : (
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-[#E07A5F]">
            <Heart className="w-10 h-10 fill-[#E07A5F]/30" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-3"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 drop-shadow-sm">
            Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] to-[#D97706]">{sisterName}</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-800 font-bold leading-relaxed bg-rose-50/80 p-4 rounded-2xl border border-rose-200 shadow-inner">
            Before you open my personal letter... <br />
            I have a special surprise lined up for you! ❤️
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="pt-2 space-y-3"
        >
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="w-full py-4 rounded-2xl text-white font-black tracking-widest text-sm sm:text-base shadow-lg shadow-rose-200 cursor-pointer border border-rose-200"
          >
            I&apos;M READY
          </motion.button>

          {/* Mobile Scroll Indicator Hint */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 animate-bounce">
            <span>Scroll down to continue</span>
            <ChevronDown className="w-4 h-4 text-[#E07A5F]" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
