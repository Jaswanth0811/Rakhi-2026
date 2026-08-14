"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface RatingQuestionProps {
  optionId?: string;
  onSelect: (optionId: string, value: string) => void;
}

const RATING_LABELS: Record<number, { emoji: string; text: string }> = {
  1: { emoji: "😇", text: "Very innocent" },
  2: { emoji: "😊", text: "Sweet sibling" },
  3: { emoji: "🍬", text: "Cute & harmless" },
  4: { emoji: "😏", text: "Slightly mischievous" },
  5: { emoji: "😂", text: "Acceptable" },
  6: { emoji: "😜", text: "Playfully annoying" },
  7: { emoji: "😤", text: "Highly annoying" },
  8: { emoji: "🔥", text: "Pure chaos" },
  9: { emoji: "💥", text: "Total trouble" },
  10: { emoji: "😭", text: "Absolutely unbearable" },
};

export default function RatingQuestion({ optionId = "rating_opt", onSelect }: RatingQuestionProps) {
  const [val, setVal] = useState<number>(5);

  const currentLabel = RATING_LABELS[val] || { emoji: "😂", text: "Acceptable" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full space-y-6 bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 backdrop-blur-md text-center shadow-md"
    >
      {/* Big Animated Rating Display */}
      <div className="space-y-2">
        <span className="text-5xl sm:text-6xl animate-bounce inline-block">
          {currentLabel.emoji}
        </span>
        <div className="font-serif text-3xl font-bold text-[#E07A5F]">
          {val} <span className="text-sm font-sans text-gray-600 font-bold">/ 10</span>
        </div>
        <p className="text-base font-extrabold text-gray-900 bg-rose-50 py-2 px-4 rounded-xl border border-rose-200 inline-block shadow-sm">
          {currentLabel.text}
        </p>
      </div>

      {/* Range Slider */}
      <div className="space-y-3 px-2">
        <input
          type="range"
          min={1}
          max={10}
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="w-full h-3.5 rounded-lg appearance-none cursor-pointer bg-rose-100 border border-rose-300 accent-[#E07A5F]"
        />
        <div className="flex justify-between text-xs text-gray-800 font-mono font-bold">
          <span>1 (Innocent)</span>
          <span>10 (Unbearable)</span>
        </div>
      </div>

      <button
        onClick={() => onSelect(optionId, String(val))}
        style={{
          background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
        }}
        className="w-full py-4 rounded-2xl text-white font-black tracking-widest text-base shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-rose-200"
      >
        CONFIRM RATING ({val}/10)
      </button>
    </motion.div>
  );
}
