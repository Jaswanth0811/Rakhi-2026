"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface TextQuestionProps {
  optionId?: string;
  onSelect: (optionId: string, value: string) => void;
}

export default function TextQuestion({ optionId = "text_opt", onSelect }: TextQuestionProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSelect(optionId, text.trim());
  };

  const isEnabled = text.trim().length > 0;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="w-full space-y-5"
    >
      <div className="relative">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your answer here..."
          maxLength={500}
          className="w-full p-4 sm:p-5 rounded-2xl bg-white border-2 border-rose-300 focus:border-[#E07A5F] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none font-sans text-base sm:text-lg font-bold transition-all shadow-inner"
        />
        <div className="absolute bottom-3 right-4 text-xs text-gray-700 font-mono font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
          {text.length} / 500
        </div>
      </div>

      <button
        type="submit"
        disabled={!isEnabled}
        style={
          isEnabled
            ? {
                background:
                  "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
              }
            : {}
        }
        className={`w-full py-4 rounded-2xl font-black tracking-widest text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md border ${
          isEnabled
            ? "text-white border-rose-200 shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        }`}
      >
        <span>SAVE MY ANSWER</span>
        <Send className={`w-4 h-4 ${isEnabled ? "text-white" : "text-gray-400"}`} />
      </button>
    </motion.form>
  );
}
