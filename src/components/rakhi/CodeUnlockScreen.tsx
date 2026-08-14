"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, AlertCircle, Delete, KeyRound, ChevronDown } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface CodeUnlockScreenProps {
  onUnlockSuccess: (sisterName: string) => void;
}

export default function CodeUnlockScreen({ onUnlockSuccess }: CodeUnlockScreenProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const submitCode = async (codeToSubmit: string) => {
    if (codeToSubmit.length !== 6) return;

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/rakhi/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToSubmit }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Invalid secret code.");
        triggerShake();
        setIsVerifying(false);
        return;
      }

      sfx.playChime();
      setTimeout(() => {
        setIsVerifying(false);
        onUnlockSuccess(data.sisterName);
      }, 700);
    } catch {
      setErrorMsg("Connection error. Please try again.");
      triggerShake();
      setIsVerifying(false);
    }
  };

  const handleKeypadPress = (numStr: string) => {
    sfx.playPop();
    if (errorMsg) setErrorMsg(null);
    const emptyIndex = digits.findIndex((d) => d === "");
    if (emptyIndex === -1) return;

    const nextDigits = [...digits];
    nextDigits[emptyIndex] = numStr;
    setDigits(nextDigits);

    if (emptyIndex === 5) {
      const full = nextDigits.join("");
      submitCode(full);
    }
  };

  const handleBackspace = () => {
    sfx.playPop();
    if (errorMsg) setErrorMsg(null);
    const lastFilledIndex = digits.map((d) => d !== "").lastIndexOf(true);
    if (lastFilledIndex === -1) return;

    const nextDigits = [...digits];
    nextDigits[lastFilledIndex] = "";
    setDigits(nextDigits);
  };

  const handleChange = (index: number, value: string) => {
    sfx.playPop();
    if (errorMsg) setErrorMsg(null);
    const cleaned = value.replace(/[^0-9]/g, "");

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split("");
      const nextDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 6) nextDigits[i] = char;
      });
      setDigits(nextDigits);
      if (nextDigits.every((d) => d !== "")) {
        submitCode(nextDigits.join(""));
      }
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    setDigits(nextDigits);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (nextDigits.every((d) => d !== "")) {
      submitCode(nextDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full p-4 sm:p-6 z-10 text-gray-900">
      <motion.div
        animate={
          isShaking
            ? { x: [-10, 10, -8, 8, -4, 4, 0] }
            : { y: [0, -6, 0] }
        }
        transition={
          isShaking
            ? { duration: 0.5 }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        className="w-full max-w-md rounded-3xl bg-white/95 border-2 border-rose-200/80 p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(224,122,95,0.15)] backdrop-blur-xl relative overflow-hidden text-center"
      >
        {/* Top Floating Glow Chips */}
        <div className="flex justify-center mb-1">
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-[#E07A5F] shadow-sm animate-pulse">
            <Lock className="w-7 h-7" />
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[#E07A5F] font-black flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            Rakhi 2026 Secret Access
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Enter Secret Passcode
          </h1>
          <p className="text-xs text-gray-600 font-bold leading-relaxed">
            Enter your 6-digit passcode to unlock your personalized Rakhi surprise.
          </p>
        </div>

        {/* 6 Digit Input Display */}
        <div className="flex justify-center gap-2 sm:gap-2.5 my-4">
          {digits.map((digit, idx) => (
            <div key={idx} className="relative">
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-10 h-12 sm:w-11 sm:h-13 rounded-2xl bg-rose-50/60 border-2 text-center text-xl font-mono font-extrabold text-gray-900 focus:outline-none transition-all shadow-inner ${
                  digit
                    ? "border-[#E07A5F] bg-rose-100/80 shadow-xs"
                    : "border-rose-200 focus:border-[#E07A5F]"
                }`}
              />
              {digit && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
              )}
            </div>
          ))}
        </div>

        {/* Error Feedback */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center justify-center gap-1.5 text-xs text-rose-800 font-bold bg-rose-50 border border-rose-200 p-2.5 rounded-xl shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tactile Mobile Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeypadPress(num)}
              className="py-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-gray-900 font-mono font-extrabold text-xl hover:bg-rose-100 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center p-2 text-rose-300">
            <KeyRound className="w-5 h-5 text-[#E07A5F]/40" />
          </div>
          <button
            onClick={() => handleKeypadPress("0")}
            className="py-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-gray-900 font-mono font-extrabold text-xl hover:bg-rose-100 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3.5 rounded-2xl bg-rose-100/80 border border-rose-300 text-gray-800 flex items-center justify-center hover:bg-rose-200 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Motion Hint */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-500 pt-2 animate-bounce">
          <span>Tap 🎈 floating toys to pop them!</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#E07A5F]" />
        </div>
      </motion.div>
    </div>
  );
}
