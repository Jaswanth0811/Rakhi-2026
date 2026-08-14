"use client";

import { motion } from "framer-motion";

interface Option {
  id: string;
  label: string;
  value: string;
}

interface EmojiQuestionProps {
  options: Option[];
  onSelect: (optionId: string, value: string) => void;
}

export default function EmojiQuestion({ options, onSelect }: EmojiQuestionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
      {options.map((opt, index) => (
        <motion.button
          key={opt.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => onSelect(opt.id, opt.value)}
          className="group flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-white border-2 border-rose-200 hover:border-[#E07A5F] backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-rose-200 hover:-translate-y-1 active:scale-95 cursor-pointer"
        >
          <span className="text-4xl sm:text-5xl mb-2 transform group-hover:scale-125 transition-transform duration-300">
            {opt.value || opt.label.split(" ")[0]}
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-[#E07A5F] text-center">
            {opt.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
