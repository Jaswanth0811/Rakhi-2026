"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Play, SkipForward, RotateCcw, Mail, Eye } from "lucide-react";
import CinematicUnlock from "@/components/rakhi/CinematicUnlock";
import PersonalIntro from "@/components/rakhi/PersonalIntro";
import QuestionContainer from "@/components/rakhi/QuestionContainer";
import FinalLetter from "@/components/rakhi/FinalLetter";
import RakhiCanvasReveal from "@/components/rakhi/RakhiCanvasReveal";
import ClosingScreen from "@/components/rakhi/ClosingScreen";
import ParticleCanvas from "@/components/rakhi/ParticleCanvas";

type PreviewStep =
  | "INTRO"
  | "PERSONAL_INTRO"
  | "QUESTIONS"
  | "FINAL_LETTER"
  | "RAKHI_REVEAL"
  | "CLOSING";

export default function SisterPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sisterData, setSisterData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<PreviewStep>("INTRO");

  useEffect(() => {
    fetchSisterData();
  }, [id]);

  const fetchSisterData = async () => {
    try {
      const res = await fetch(`/api/admin/sisters/${id}`);
      if (res.ok) {
        const json = await res.json();
        setSisterData(json.sister);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gold">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!sisterData) {
    return <div className="text-center py-20 text-goldlight/70">Sister data not found.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Admin Preview Floating Control Bar */}
      <div className="sticky top-4 z-50 bg-[#16141D]/90 border border-gold/40 backdrop-blur-md rounded-2xl p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href={`/rakhi/admin/sisters/${id}`}
            className="p-2 rounded-lg bg-white/5 text-goldlight hover:text-cream"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
              PREVIEW MODE ({sisterData.name})
            </span>
          </div>
        </div>

        {/* Shortcut Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setStep("INTRO")}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-cream hover:bg-white/10 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>

          <button
            onClick={() => setStep("QUESTIONS")}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-cream hover:bg-white/10 flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Questions</span>
          </button>

          <button
            onClick={() => setStep("FINAL_LETTER")}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-cream hover:bg-white/10 flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Letter</span>
          </button>

          <button
            onClick={() => setStep("RAKHI_REVEAL")}
            className="px-3 py-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40 flex items-center gap-1 font-bold"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rakhi Climax</span>
          </button>
        </div>
      </div>

      {/* Embedded Sister Experience Viewport */}
      <div className="relative min-h-[75vh] w-full rounded-3xl overflow-hidden border-2 border-gold/30 bg-charcoal shadow-2xl">
        <ParticleCanvas color="#F4E091" />

        {step === "INTRO" && (
          <CinematicUnlock
            sisterName={sisterData.name}
            onNext={() => setStep("PERSONAL_INTRO")}
          />
        )}

        {step === "PERSONAL_INTRO" && (
          <PersonalIntro
            sisterName={sisterData.name}
            photoUrl={sisterData.photoUrl}
            onNext={() => setStep("QUESTIONS")}
          />
        )}

        {step === "QUESTIONS" && (
          <QuestionContainer
            questions={sisterData.questions || []}
            memories={sisterData.memories || []}
            onCompleteAll={() => setStep("FINAL_LETTER")}
          />
        )}

        {step === "FINAL_LETTER" && (
          <FinalLetter
            sisterName={sisterData.name}
            photoUrl={sisterData.photoUrl}
            finalMessage={sisterData.finalMessage}
            onNext={() => setStep("RAKHI_REVEAL")}
          />
        )}

        {step === "RAKHI_REVEAL" && (
          <RakhiCanvasReveal
            sisterName={sisterData.name}
            onNext={() => setStep("CLOSING")}
          />
        )}

        {step === "CLOSING" && (
          <ClosingScreen
            sisterName={sisterData.name}
            onReplay={() => setStep("INTRO")}
            onViewLetter={() => setStep("FINAL_LETTER")}
          />
        )}
      </div>
    </div>
  );
}
