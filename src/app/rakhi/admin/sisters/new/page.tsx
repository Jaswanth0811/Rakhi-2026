"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Sparkles, CheckCircle, ArrowRight, Wand2, Palette, Music, Sliders, RefreshCw } from "lucide-react";
import AIRephraseModal from "@/components/admin/AIRephraseModal";

export default function CreateSisterWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const [themeId, setThemeId] = useState("warm_sunset");
  const [songId, setSongId] = useState("song_emotional_acoustic");
  const [motionStyle, setMotionStyle] = useState("slow_emotional");
  const [customCode, setCustomCode] = useState("");

  // DB Options
  const [themes, setThemes] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);

  // AI State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [rephraseModalOpen, setRephraseModalOpen] = useState(false);

  // Result State
  const [createdSister, setCreatedSister] = useState<any | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDbOptions();
  }, []);

  const fetchDbOptions = async () => {
    try {
      const [thRes, sgRes] = await Promise.all([
        fetch("/api/admin/themes"),
        fetch("/api/admin/songs"),
      ]);

      if (thRes.ok) {
        const thData = await thRes.json();
        setThemes(thData.themes || []);
      }

      if (sgRes.ok) {
        const sgData = await sgRes.json();
        setSongs(sgData.songs || []);
        if (sgData.songs && sgData.songs.length > 0) {
          setSongId(sgData.songs[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunAI = async () => {
    if (!finalMessage.trim()) {
      setError("Please enter a final message first to analyze.");
      return;
    }

    setAiAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sisterId: "temp",
          message: finalMessage,
        }),
      });

      const json = await res.json();
      if (res.ok && json.analysis) {
        setAiResult(json.analysis);
        if (json.analysis.createdTheme?.id) {
          setThemeId(json.analysis.createdTheme.id);
        }
        if (json.analysis.motionStyle) {
          setMotionStyle(json.analysis.motionStyle);
        }
      }
    } catch {
      setError("AI analysis failed.");
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleCreateSister = async () => {
    if (!name.trim()) {
      setError("Sister name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/sisters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          photoUrl: photoUrl.trim() || null,
          finalMessage: finalMessage.trim(),
          themeId,
          songId,
          motionStyle,
          customCode: customCode.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create sister.");
        setSubmitting(false);
        return;
      }

      setCreatedSister(data.sister);
      setGeneratedCode(data.generatedCode);
      setStep(4); // Move to completion step
    } catch {
      setError("Error creating sister.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-6 pb-24 text-gray-900">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Create Sister Experience</h1>
        <p className="text-sm text-gray-600 font-semibold">
          Follow the step-by-step wizard to build a personalized Rakhi surprise.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between border-b border-rose-200 pb-4 text-xs font-bold text-gray-500">
        <span className={step >= 1 ? "text-[#E07A5F]" : ""}>1. Basic Info</span>
        <span>→</span>
        <span className={step >= 2 ? "text-[#E07A5F]" : ""}>2. Final Letter</span>
        <span>→</span>
        <span className={step >= 3 ? "text-[#E07A5F]" : ""}>3. AI Personalization</span>
        <span>→</span>
        <span className={step >= 4 ? "text-[#E07A5F]" : ""}>4. Access Code</span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 font-bold text-xs">
          {error}
        </div>
      )}

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md"
        >
          <h2 className="font-serif text-xl font-bold text-gray-900">Step 1: Sister Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                SISTER NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anusha, Sravani, Priyanka..."
                className="w-full p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-bold focus:border-[#E07A5F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                PHOTO URL (OPTIONAL)
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-bold focus:border-[#E07A5F] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                if (!name.trim()) {
                  setError("Sister name is required.");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
              }}
              className="py-3.5 px-6 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer border border-rose-200"
            >
              <span>NEXT: FINAL LETTER</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Final Letter */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-gray-900">Step 2: Write Final Letter</h2>
            <button
              onClick={() => setRephraseModalOpen(true)}
              disabled={!finalMessage.trim()}
              className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-300 text-purple-900 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs hover:bg-purple-100"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-700" />
              <span>REPHRASE WITH AI</span>
            </button>
          </div>

          <div>
            <textarea
              rows={8}
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              placeholder="Dear sister, thank you for always being there for me..."
              className="w-full p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-serif text-base font-bold focus:border-[#E07A5F] focus:outline-none resize-none shadow-inner"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="py-3.5 px-6 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
            >
              BACK
            </button>
            <button
              onClick={() => setStep(3)}
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
              }}
              className="py-3.5 px-6 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer border border-rose-200"
            >
              <span>NEXT: AI PERSONALIZATION</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: AI & Theme Personalization */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-200 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">Step 3: AI & Theme Selection</h2>
              <p className="text-xs text-gray-600 font-semibold">Gemini 2.5 Flash custom engine analysis</p>
            </div>

            <button
              onClick={handleRunAI}
              disabled={aiAnalyzing || !finalMessage.trim()}
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
              }}
              className="py-3 px-5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-md cursor-pointer border border-rose-200"
            >
              {aiAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>ANALYZING...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-white" />
                  <span>GENERATE AI THEME</span>
                </>
              )}
            </button>
          </div>

          {aiResult && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs text-purple-900 shadow-xs">
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-700" /> Gemini 2.5 AI Analysis:
              </div>
              <p>Mood: {aiResult.mood} • Tone: {aiResult.tone}</p>
              <p className="italic text-purple-800 font-serif font-semibold">&ldquo;{aiResult.reasoning}&rdquo;</p>
            </div>
          )}

          {/* Code Customization */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              CUSTOM 6-DIGIT ACCESS CODE (OPTIONAL)
            </label>
            <input
              type="text"
              maxLength={6}
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Auto-generated if left blank (e.g. 280826)"
              className="w-full p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-mono font-bold focus:border-[#E07A5F] focus:outline-none tracking-widest text-center text-lg"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="py-3.5 px-6 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
            >
              BACK
            </button>
            <button
              onClick={handleCreateSister}
              disabled={submitting}
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
              }}
              className="py-3.5 px-8 rounded-xl text-white font-extrabold text-xs shadow-lg shadow-rose-200 cursor-pointer flex items-center gap-2 border border-rose-200"
            >
              {submitting ? "CREATING..." : "CREATE SISTER NOW 🎉"}
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Success & Code Generated */}
      {step === 4 && createdSister && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-rose-200 rounded-3xl p-8 text-center space-y-6 shadow-xl"
        >
          <div className="p-4 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] w-16 h-16 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold text-gray-900">
              Experience Created for {createdSister.name}! 🎉
            </h2>
            <p className="text-xs text-gray-600 font-semibold">
              Give this mandatory 6-digit access code to {createdSister.name} so she can unlock her surprise.
            </p>
          </div>

          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 space-y-2 shadow-inner">
            <span className="text-xs uppercase font-extrabold text-[#E07A5F] tracking-widest">
              HER SECRET ACCESS CODE:
            </span>
            <div className="font-mono text-4xl font-extrabold text-[#E07A5F] tracking-widest">
              {generatedCode}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => router.push(`/rakhi/admin/sisters/${createdSister.id}`)}
              className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-xs"
            >
              GO TO SISTER HUB
            </button>
            <button
              onClick={() => router.push(`/rakhi/admin/sisters/${createdSister.id}/preview`)}
              style={{
                background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
              }}
              className="flex-1 py-3.5 rounded-xl text-white font-extrabold text-xs shadow-md border border-rose-200"
            >
              PREVIEW EXPERIENCE
            </button>
          </div>
        </motion.div>
      )}

      <AIRephraseModal
        isOpen={rephraseModalOpen}
        sisterName={name || "Sister"}
        originalMessage={finalMessage}
        onClose={() => setRephraseModalOpen(false)}
        onApply={(rephrased) => setFinalMessage(rephrased)}
      />
    </div>
  );
}
