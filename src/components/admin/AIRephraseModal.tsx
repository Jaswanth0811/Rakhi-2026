"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  Sparkles,
  Heart,
  Laugh,
  Feather,
  Zap,
  Smile,
  Shield,
  Edit3,
  X,
  Check,
  RotateCcw,
} from "lucide-react";

interface AIRephraseModalProps {
  isOpen: boolean;
  sisterName: string;
  originalMessage: string;
  onClose: () => void;
  onApply: (rephrasedMessage: string) => void;
}

const STYLES = [
  {
    id: "emotional",
    title: "Emotional & Heartfelt",
    desc: "Tear-jerking, deep love & profound gratitude",
    icon: Heart,
    color: "from-rose-100 to-pink-100 border-rose-300 text-rose-800",
  },
  {
    id: "humorous",
    title: "Humorous & Playful",
    desc: "Teasing sibling banter, witty & funny memories",
    icon: Laugh,
    color: "from-amber-100 to-yellow-100 border-amber-300 text-amber-900",
  },
  {
    id: "poetic",
    title: "Poetic & Nostalgic",
    desc: "Rhythmic imagery & childhood memories",
    icon: Feather,
    color: "from-purple-100 to-indigo-100 border-purple-300 text-purple-900",
  },
  {
    id: "punchy",
    title: "Short & Punchy",
    desc: "Concise, bold emotional impact",
    icon: Zap,
    color: "from-blue-100 to-cyan-100 border-blue-300 text-blue-900",
  },
  {
    id: "sweet",
    title: "Sweet & Gentle",
    desc: "Soft, comforting & deeply caring",
    icon: Smile,
    color: "from-emerald-100 to-teal-100 border-emerald-300 text-emerald-900",
  },
  {
    id: "formal",
    title: "Protective & Dignified",
    desc: "Honorable brother pledge & noble promise",
    icon: Shield,
    color: "from-amber-100 to-orange-100 border-amber-300 text-amber-900",
  },
];

export default function AIRephraseModal({
  isOpen,
  sisterName,
  originalMessage,
  onClose,
  onApply,
}: AIRephraseModalProps) {
  const [selectedStyle, setSelectedStyle] = useState("emotional");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [rephrasedResult, setRephrasedResult] = useState<string | null>(null);
  const [toneSummary, setToneSummary] = useState<string>("");

  if (!isOpen) return null;

  const handleRephrase = async () => {
    if (!originalMessage.trim()) {
      alert("Please write an original letter first before rephrasing!");
      return;
    }

    setLoading(true);
    setRephrasedResult(null);

    try {
      const res = await fetch("/api/admin/ai/rephrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalMessage,
          sisterName,
          rephraseStyle: selectedStyle,
          customInstruction: selectedStyle === "custom" ? customPrompt : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.rephrasedMessage) {
        setRephrasedResult(data.rephrasedMessage);
        setToneSummary(data.toneSummary || "");
      } else {
        alert(data.error || "Failed to rephrase letter.");
      }
    } catch (e) {
      console.error(e);
      alert("Rephrase error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-2xl w-full bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-gray-900 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-rose-200 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] text-xs font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini 2.5 Flash Writer</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Rephrase Letter for <span className="text-[#E07A5F]">{sisterName}</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-rose-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!rephrasedResult ? (
            /* STEP 1: Select Rephrase Style */
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Rephrasing Style / Tone:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STYLES.map((style) => {
                    const Icon = style.icon;
                    const isSelected = selectedStyle === style.id;

                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer bg-gradient-to-r ${style.color} ${
                          isSelected
                            ? "border-[#E07A5F] ring-2 ring-rose-300 scale-[1.02] shadow-md"
                            : "opacity-80 hover:opacity-100 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-1 font-bold text-sm">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{style.title}</span>
                        </div>
                        <p className="text-xs text-gray-700 font-semibold">{style.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Prompt Option */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedStyle("custom")}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                    selectedStyle === "custom" ? "text-[#E07A5F]" : "text-gray-500"
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Or enter custom instruction:</span>
                </button>

                {selectedStyle === "custom" && (
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Make it sound like a sweet childhood apology with funny memories"
                    className="w-full p-3.5 rounded-xl bg-white border-2 border-rose-200 text-gray-900 text-xs font-bold focus:outline-none focus:border-[#E07A5F]"
                  />
                )}
              </div>

              {/* Original Letter Preview */}
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">
                  Current Letter:
                </span>
                <p className="text-xs text-gray-800 italic font-serif font-semibold max-h-24 overflow-y-auto">
                  &ldquo;{originalMessage}&rdquo;
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleRephrase}
                disabled={loading}
                style={{
                  background:
                    "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
                }}
                className="w-full py-4 rounded-2xl text-white font-extrabold text-sm tracking-wider shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>REPHRASING WITH GEMINI 2.5 FLASH...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-white" />
                    <span>REPHRASE LETTER NOW</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* STEP 2: Review Side-by-Side Comparison */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl text-xs text-emerald-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Rephrased successfully! ({toneSummary})</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-gray-500 uppercase">Original Message</div>
                  <div className="text-xs text-gray-800 font-serif font-medium whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                    {originalMessage}
                  </div>
                </div>

                {/* AI Rephrased */}
                <div className="bg-white border-2 border-[#E07A5F] rounded-2xl p-4 space-y-2 shadow-md">
                  <div className="text-xs font-bold text-[#E07A5F] uppercase flex items-center justify-between">
                    <span>✨ AI Rephrased Letter</span>
                    <span className="text-[10px] bg-rose-100 text-[#E07A5F] px-2 py-0.5 rounded-full font-bold">
                      {selectedStyle}
                    </span>
                  </div>
                  <div className="text-xs text-gray-900 font-serif font-bold whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                    {rephrasedResult}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRephrasedResult(null)}
                  className="py-3.5 px-5 rounded-xl bg-white border border-gray-300 text-gray-800 font-bold text-xs hover:bg-gray-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>TRY ANOTHER TONE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onApply(rephrasedResult);
                    onClose();
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
                  }}
                  className="flex-1 py-3.5 px-6 rounded-xl text-white font-extrabold text-xs tracking-wider shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>APPLY THIS REPHRASED LETTER</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
