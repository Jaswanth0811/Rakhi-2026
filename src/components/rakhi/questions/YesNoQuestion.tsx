"use client";

import { motion } from "framer-motion";

interface Option {
  id: string;
  label: string;
  value: string;
}

interface YesNoQuestionProps {
  options: Option[];
  onSelect: (optionId: string, value: string) => void;
}

export default function YesNoQuestion({ options, onSelect }: YesNoQuestionProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
      {options.map((opt, index) => (
        <motion.button
          key={opt.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          onClick={() => onSelect(opt.id, opt.value)}
          className={`w-full sm:w-1/2 py-6 px-8 rounded-2xl border-2 text-center font-extrabold text-xl transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95 bg-white ${
            opt.value.toUpperCase().includes("YES")
              ? "border-[#E07A5F] text-gray-900 shadow-rose-200 hover:bg-rose-50"
              : "border-rose-300 text-gray-900 shadow-rose-100 hover:bg-rose-50"
          }`}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}
