"use client";

import { useState } from "react";
import CodeUnlockScreen from "@/components/rakhi/CodeUnlockScreen";
import CinematicUnlock from "@/components/rakhi/CinematicUnlock";
import PersonalIntro from "@/components/rakhi/PersonalIntro";
import QuestionContainer from "@/components/rakhi/QuestionContainer";
import FinalLetter from "@/components/rakhi/FinalLetter";
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    await fetchExperienceData();
    setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900 font-serif text-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#E07A5F] font-bold">Unlocking Your Surprise...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-[100dvh] w-full bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900 overflow-hidden font-sans select-none">
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
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 border border-rose-300 text-[#E07A5F] text-xs font-extrabold shadow-md hover:bg-rose-50 transition-all cursor-pointer backdrop-blur-xl"
        >
          <Lock className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span className="hidden sm:inline">Enter Another Code</span>
          <span className="sm:hidden">Lock</span>
        </button>
      )}

      {/* Mobile-First Reel Vertical Snapping Container */}
      <div className="h-[100dvh] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth custom-scrollbar">
        {step === "CODE_UNLOCK" && (
          <section className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative">
            <CodeUnlockScreen onUnlockSuccess={handleUnlockSuccess} />
          </section>
        )}

        {step === "CINEMATIC_UNLOCK" && data && (
          <section className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative">
            <CinematicUnlock
              sisterName={data.sister.name}
              onNext={() => setStep("PERSONAL_INTRO")}
            />
          </section>
        )}

        {step === "PERSONAL_INTRO" && data && (
          <section className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative">
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
          </section>
        )}

        {step === "QUESTIONS" && data && (
          <section className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative">
            <QuestionContainer
              questions={data.questions}
              memories={data.memories}
              onCompleteAll={handleCompleteAllQuestions}
            />
          </section>
        )}

        {step === "FINAL_LETTER" && data && (
          <section className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative">
            <FinalLetter
              sisterName={data.sister.name}
              photoUrl={data.sister.photoUrl}
              finalMessage={data.sister.finalMessage}
              onNext={() => setStep("RAKHI_REVEAL")}
            />
          </section>
        )}

        {step === "RAKHI_REVEAL" && data && (
          <section className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative">
            <RakhiCanvasReveal
              sisterName={data.sister.name}
              onNext={() => setStep("CLOSING")}
            />
          </section>
        )}

        {step === "CLOSING" && data && (
          <section className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative">
            <ClosingScreen
              sisterName={data.sister.name}
              onReplay={() => setStep("CINEMATIC_UNLOCK")}
              onViewLetter={() => setStep("FINAL_LETTER")}
            />
          </section>
        )}
      </div>
    </main>
  );
}
