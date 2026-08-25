"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeUnlockScreen from "@/components/rakhi/CodeUnlockScreen";
import CinematicUnlock from "@/components/rakhi/CinematicUnlock";
import PersonalIntro from "@/components/rakhi/PersonalIntro";
import QuestionContainer from "@/components/rakhi/QuestionContainer";
import FinalLetter from "@/components/rakhi/FinalLetter";
import SisterReplyScreen from "@/components/rakhi/SisterReplyScreen";
import RakhiCanvasReveal from "@/components/rakhi/RakhiCanvasReveal";
import ClosingScreen from "@/components/rakhi/ClosingScreen";
import ParticleCanvas from "@/components/rakhi/ParticleCanvas";
import MusicPlayer from "@/components/rakhi/MusicPlayer";
import { Lock } from "lucide-react";

type Step =
  | "CODE_UNLOCK"
  | "CINEMATIC_UNLOCK"
  | "PERSONAL_INTRO"
  | "QUESTIONS"
  | "FINAL_LETTER"
  | "SISTER_REPLY"
  | "RAKHI_REVEAL"
  | "CLOSING";

interface SisterExperienceData {
  sister: {
    id: string;
    name: string;
    photoUrl?: string | null;
    finalMessage: string;
    motionStyle: string;
  };
  questions: any[];
  memories: any[];
  theme: any;
  song: any;
}

export default function RakhiPublicPage() {
  const [step, setStep] = useState<Step>("CODE_UNLOCK");
  const [data, setData] = useState<SisterExperienceData | null>(null);

  const fetchExperienceData = async () => {
    try {
      const res = await fetch("/api/rakhi/experience");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setStep("CINEMATIC_UNLOCK");
      }
    } catch (e) {
      console.error(e);
      setStep("CODE_UNLOCK");
    }
  };

  const handleUnlockSuccess = async () => {
    await fetchExperienceData();
  };

  const handleLockSession = async () => {
    try {
      await fetch("/api/rakhi/lock", { method: "POST" });
    } catch {
      // Ignore
    }
    setData(null);
    setStep("CODE_UNLOCK");
  };

  const handleCompleteAllQuestions = async () => {
    try {
      await fetch("/api/rakhi/complete", { method: "POST" });
    } catch {
      // Ignore
    }
    setStep("FINAL_LETTER");
  };

  return (
    <main className="relative min-h-[100dvh] w-full bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900 overflow-hidden font-sans select-none touch-manipulation">
      {/* Light Theme Dynamic Stardust Particles */}
      <ParticleCanvas color={data?.theme?.particleColor || "#F4ACB7"} />

      {/* Floating Ambient Music Player */}
      <MusicPlayer
        songUrl={data?.song?.audioUrl}
        songTitle={data?.song?.title}
        artist={data?.song?.artist}
      />

      {/* Mobile Lock / Switch Code floating glass button */}
      {step !== "CODE_UNLOCK" && (
        <button
          onClick={handleLockSession}
          title="Enter another code"
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 border border-rose-300 text-[#E07A5F] text-xs font-extrabold shadow-md hover:bg-rose-50 transition-all cursor-pointer backdrop-blur-xl active:scale-95"
        >
          <Lock className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span className="hidden sm:inline">Enter Another Code</span>
          <span className="sm:hidden">Lock</span>
        </button>
      )}

      {/* Mobile-First Reel Vertical Snapping Container */}
      <div className="h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth custom-scrollbar">
        <AnimatePresence mode="wait">
          {step === "CODE_UNLOCK" && (
            <motion.section
              key="code-unlock-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative will-change-transform"
            >
              <CodeUnlockScreen onUnlockSuccess={handleUnlockSuccess} />
            </motion.section>
          )}

          {step === "CINEMATIC_UNLOCK" && data && (
            <motion.section
              key="cinematic-unlock-step"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative will-change-transform"
            >
              <CinematicUnlock
                sisterName={data.sister.name}
                onNext={() => setStep("PERSONAL_INTRO")}
              />
            </motion.section>
          )}

          {step === "PERSONAL_INTRO" && data && (
            <motion.section
              key="personal-intro-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative will-change-transform"
            >
              <PersonalIntro
                sisterName={data.sister.name}
                photoUrl={data.sister.photoUrl}
                onNext={() => {
                  if (!data.questions || data.questions.length === 0) {
                    setStep("FINAL_LETTER");
                  } else {
                    setStep("QUESTIONS");
                  }
                }}
              />
            </motion.section>
          )}

          {step === "QUESTIONS" && data && (
            <motion.section
              key="questions-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative will-change-transform"
            >
              <QuestionContainer
                questions={data.questions}
                memories={data.memories}
                onCompleteAll={handleCompleteAllQuestions}
              />
            </motion.section>
          )}

          {step === "FINAL_LETTER" && data && (
            <motion.section
              key="final-letter-step"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative will-change-transform"
            >
              <FinalLetter
                sisterName={data.sister.name}
                photoUrl={data.sister.photoUrl}
                finalMessage={data.sister.finalMessage}
                onNext={() => setStep("SISTER_REPLY")}
              />
            </motion.section>
          )}

          {step === "SISTER_REPLY" && data && (
            <motion.section
              key="sister-reply-step"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative will-change-transform"
            >
              <SisterReplyScreen
                sisterName={data.sister.name}
                onNext={() => setStep("RAKHI_REVEAL")}
              />
            </motion.section>
          )}

          {step === "RAKHI_REVEAL" && data && (
            <motion.section
              key="rakhi-reveal-step"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative will-change-transform"
            >
              <RakhiCanvasReveal
                sisterName={data.sister.name}
                onNext={() => setStep("CLOSING")}
              />
            </motion.section>
          )}

          {step === "CLOSING" && data && (
            <motion.section
              key="closing-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative will-change-transform"
            >
              <ClosingScreen
                sisterName={data.sister.name}
                onReplay={() => setStep("CINEMATIC_UNLOCK")}
                onViewLetter={() => setStep("FINAL_LETTER")}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
