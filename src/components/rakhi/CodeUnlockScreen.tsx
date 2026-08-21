"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, AlertCircle, Delete, KeyRound, Play, Pause, Gift, Calendar, Video, ArrowRight, RotateCcw } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface CodeUnlockScreenProps {
  onUnlockSuccess: (sisterName: string) => void;
}

export default function CodeUnlockScreen({ onUnlockSuccess }: CodeUnlockScreenProps) {
  const [stage, setStage] = useState<"intro" | "passcode">("intro");
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

  // Motion video reel text cycler
  useEffect(() => {
    if (stage !== "intro" || !isPlayingMotion) return;
    const interval = setInterval(() => {
      setMotionTextIndex((prev) => (prev + 1) % motionMessages.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [stage, isPlayingMotion]);

  useEffect(() => {
    if (stage === "passcode") {
      inputRefs.current[0]?.focus();
    }
  }, [stage]);

  const handleStartPasscode = () => {
    sfx.playChime();
    setStage("passcode");
  };

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
      <AnimatePresence mode="wait">
        {/* STAGE 1: Full-Screen Motion.so Presentation Video Reel First */}
        {stage === "intro" ? (
          <motion.div
            key="motion-intro"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg rounded-3xl bg-gradient-to-br from-rose-950 via-rose-900 to-amber-950 p-6 sm:p-8 space-y-6 shadow-[0_25px_60px_rgba(159,18,57,0.3)] border-2 border-rose-300/40 text-white relative overflow-hidden text-center backdrop-blur-2xl"
          >
            {/* Top Motion Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full bg-rose-500/30 border border-rose-300/40 text-rose-100 flex items-center gap-1.5 shadow-xs">
                <Video className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Motion.so Presentation
              </span>
              <button
                onClick={() => setIsPlayingMotion(!isPlayingMotion)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              >
                {isPlayingMotion ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            {/* Glowing Center Icon */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center my-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300/40"
              />
              <div className="p-4 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-rose-950 shadow-lg shadow-rose-900/50">
                <Gift className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            {/* Motion Video Dynamic Messages */}
            <div className="space-y-3 min-h-[110px] flex flex-col items-center justify-center px-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Special Surprise Announcement
              </span>

              <AnimatePresence mode="wait">
                <motion.h2
                  key={motionTextIndex}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="font-serif text-xl sm:text-2xl font-extrabold text-rose-100 leading-relaxed drop-shadow-md"
                >
                  &ldquo;{motionMessages[motionTextIndex]}&rdquo;
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Reel Progress Dots */}
            <div className="flex justify-center items-center gap-2 pt-2">
              {motionMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setMotionTextIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === motionTextIndex ? "bg-amber-300 w-8" : "bg-white/30 w-2 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Action CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartPasscode}
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #F4ACB7 50%, #E07A5F 100%)",
              }}
              className="w-full py-4 rounded-2xl text-gray-950 font-serif font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 border border-amber-200 cursor-pointer"
            >
              <span>ENTER YOUR BIRTHDAY CODE 🔑</span>
              <ArrowRight className="w-4 h-4 text-gray-950" />
            </motion.button>
          </motion.div>
        ) : (
          /* STAGE 2: 4-Digit Passcode Entry Keypad */
          <motion.div
            key="passcode-keypad"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={
              isShaking
                ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.95 }}
            transition={
              isShaking
                ? { duration: 0.5 }
                : { duration: 0.4, ease: "easeOut" }
            }
            className="w-full max-w-md rounded-3xl bg-white/95 border-2 border-rose-200/80 p-5 sm:p-7 space-y-5 shadow-[0_20px_50px_rgba(224,122,95,0.15)] backdrop-blur-xl relative overflow-hidden text-center"
          >
            {/* Replay Motion Header Pill */}
            <div className="flex justify-between items-center mb-1">
              <button
                onClick={() => setStage("intro")}
                className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-rose-100 transition-all cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3 h-3" /> Replay Motion Video 🎬
              </button>

              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-[#E07A5F] shadow-xs">
                <Lock className="w-5 h-5" />
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
        )}
      </AnimatePresence>
    </div>
  );
}
