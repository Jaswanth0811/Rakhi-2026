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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full select-none touch-manipulation">
      {options.map((opt, index) => (
        <motion.button
          key={opt.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          onClick={() => onSelect(opt.id, opt.value)}
          className={`w-full sm:w-1/2 py-5 px-7 rounded-2xl border-2 text-center font-extrabold text-lg sm:text-xl transition-all duration-150 shadow-md cursor-pointer active:scale-95 bg-white ${
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
