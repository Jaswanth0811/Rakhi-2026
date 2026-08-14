"use client";

import { motion } from "framer-motion";

interface Option {
  id: string;
  label: string;
  value: string;
}

interface MultipleChoiceQuestionProps {
  options: Option[];
  onSelect: (optionId: string, value: string) => void;
}

export default function MultipleChoiceQuestion({
  options,
  onSelect,
}: MultipleChoiceQuestionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
      {options.map((opt, index) => (
        <motion.button
          key={opt.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => onSelect(opt.id, opt.value)}
          className="group relative w-full p-4 sm:p-5 rounded-2xl bg-white border-2 border-rose-200 hover:border-[#E07A5F] backdrop-blur-md text-left transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-rose-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#E07A5F] transition-colors">
              {opt.label}
            </span>
            <span className="w-4 h-4 rounded-full border-2 border-rose-300 group-hover:border-[#E07A5F] group-hover:bg-[#E07A5F] transition-colors" />
          </div>
        </motion.button>
      ))}
    </div>
  );
}
