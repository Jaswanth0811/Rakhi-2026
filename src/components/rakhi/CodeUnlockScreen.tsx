"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, AlertCircle, Delete, KeyRound, Play, Pause, Gift, Calendar, Video } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface CodeUnlockScreenProps {
  onUnlockSuccess: (sisterName: string) => void;
}

export default function CodeUnlockScreen({ onUnlockSuccess }: CodeUnlockScreenProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isPlayingMotion, setIsPlayingMotion] = useState(true);
  const [motionTextIndex, setMotionTextIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const motionMessages = [
    "Hey Sis, Happy RakshaBandhan! 🎀",
    "I Want to Give You Something Special, So I Created This... ❤️",
    "The passcode is the DDMM of your Birthday! 🎂",
  ];

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Motion video reel text cycler
  useEffect(() => {
    if (!isPlayingMotion) return;
    const interval = setInterval(() => {
      setMotionTextIndex((prev) => (prev + 1) % motionMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlayingMotion]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const submitCode = async (codeToSubmit: string) => {
    if (codeToSubmit.length < 4) return;

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
        setErrorMsg(data.error || "Invalid passcode.");
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

    if (emptyIndex === digits.length - 1) {
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
      const pasted = cleaned.slice(0, 4).split("");
      const nextDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 4) nextDigits[i] = char;
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

    if (cleaned && index < digits.length - 1) {
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
        className="w-full max-w-md rounded-3xl bg-white/95 border-2 border-rose-200/80 p-5 sm:p-7 space-y-5 shadow-[0_20px_50px_rgba(224,122,95,0.15)] backdrop-blur-xl relative overflow-hidden text-center"
      >
        {/* Motion.so Animated Video Reel Card */}
        <div className="relative rounded-2xl bg-gradient-to-br from-rose-900 via-rose-800 to-amber-900 p-4 text-white shadow-md overflow-hidden border border-rose-300">
          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
            <span className="text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full bg-rose-500/30 border border-rose-300/40 text-rose-100 flex items-center gap-1">
              <Video className="w-3 h-3 text-rose-200 animate-pulse" /> Motion.so
            </span>
            <button
              onClick={() => setIsPlayingMotion(!isPlayingMotion)}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
            >
              {isPlayingMotion ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
              A Special Video Message For You
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={motionTextIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="min-h-[60px] flex items-center justify-center"
            >
              <p className="font-serif text-base sm:text-lg font-bold text-rose-100 leading-snug drop-shadow-sm px-2">
                &ldquo;{motionMessages[motionTextIndex]}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between text-[10px] text-rose-200/80 pt-2 border-t border-rose-700/50 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-300" /> DDMM Birthday Passcode
            </span>
            <div className="flex gap-1">
              {motionMessages.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === motionTextIndex ? "bg-amber-300 w-3" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lock Header */}
        <div className="space-y-1">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            Enter 4-Digit Birthday Code
          </h1>
          <p className="text-xs text-gray-600 font-bold">
            Enter your birthday date & month in <span className="text-[#E07A5F]">DDMM</span> order (e.g. 2808 for 28th Aug)
          </p>
        </div>

        {/* 4 Digit DDMM Input Display */}
        <div className="flex justify-center gap-3 my-2">
          {digits.map((digit, idx) => (
            <div key={idx} className="relative">
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                placeholder={idx < 2 ? "D" : "M"}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-rose-50/60 border-2 text-center text-2xl font-mono font-extrabold text-gray-900 focus:outline-none transition-all shadow-inner ${
                  digit
                    ? "border-[#E07A5F] bg-rose-100/90 shadow-xs"
                    : "border-rose-200 focus:border-[#E07A5F]"
                }`}
              />
              {digit && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
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

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeypadPress(num)}
              className="py-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-gray-900 font-mono font-extrabold text-xl hover:bg-rose-100 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center p-2 text-rose-300">
            <KeyRound className="w-5 h-5 text-[#E07A5F]/40" />
          </div>
          <button
            onClick={() => handleKeypadPress("0")}
            className="py-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-gray-900 font-mono font-extrabold text-xl hover:bg-rose-100 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3 rounded-2xl bg-rose-100/80 border border-rose-300 text-gray-800 flex items-center justify-center hover:bg-rose-200 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
