"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface MemoryRevealModalProps {
  imageUrl: string;
  caption?: string | null;
  onClose: () => void;
}

export default function MemoryRevealModal({ imageUrl, caption, onClose }: MemoryRevealModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-950/60 backdrop-blur-xl overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-lg w-full bg-white/95 border-2 border-rose-200 rounded-3xl p-6 text-center space-y-5 shadow-2xl"
        >
          <div className="text-xs uppercase tracking-widest text-[#E07A5F] font-black">
            You Chose This Memory...
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            And honestly... I still remember this day. ❤️
          </h3>

          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border-2 border-rose-200 shadow-md bg-rose-50">
            <Image
              src={imageUrl}
              alt={caption || "Memory"}
              fill
              className="object-cover animate-pulse-slow"
            />
          </div>

          {caption && (
            <p className="text-sm sm:text-base text-gray-800 font-extrabold italic font-serif leading-relaxed px-2 bg-rose-50 p-3 rounded-xl border border-rose-200">
              &ldquo;{caption}&rdquo;
            </p>
          )}

          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="w-full py-4 rounded-2xl text-white font-black tracking-widest text-base shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-rose-200"
          >
            CONTINUE EXPERIENCE
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
