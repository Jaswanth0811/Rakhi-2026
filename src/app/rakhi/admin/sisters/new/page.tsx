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
    <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-6 pb-24 text-white">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Create Sister Experience</h1>
        <p className="text-sm text-gray-300">
          Follow the step-by-step wizard to build a personalized Rakhi surprise.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between border-b border-gold/30 pb-4 text-xs font-semibold text-gray-400">
        <span className={step >= 1 ? "text-gold font-bold" : ""}>1. Basic Info</span>
        <span>→</span>
        <span className={step >= 2 ? "text-gold font-bold" : ""}>2. Final Letter</span>
        <span>→</span>
        <span className={step >= 3 ? "text-gold font-bold" : ""}>3. AI Personalization</span>
        <span>→</span>
        <span className={step >= 4 ? "text-gold font-bold" : ""}>4. Access Code</span>
      </div>

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#14121B] border border-gold/30 rounded-3xl p-6 space-y-5 shadow-xl">
            <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-gold" /> Step 1: Basic Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gold/90 mb-2 uppercase tracking-wider">
                SISTER NAME *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anusha"
                className="w-full p-4 rounded-xl bg-black border border-gold/40 text-white font-bold focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold/90 mb-2 uppercase tracking-wider">
                PHOTO URL (OPTIONAL)
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-4 rounded-xl bg-black border border-gold/40 text-white font-bold focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!name.trim()) setError("Please enter sister's name.");
              else {
                setError(null);
                setStep(2);
              }
            }}
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #F4E091 50%, #AA820A 100%)",
            }}
            className="w-full py-4 rounded-2xl text-black font-extrabold text-sm tracking-wider shadow-xl shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer border border-goldlight"
          >
            <span>NEXT: WRITE FINAL LETTER</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </motion.div>
      )}

      {/* STEP 2: Final Message */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#14121B] border border-gold/30 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" /> Step 2: Personal Final Message
              </h2>

              <button
                type="button"
                onClick={() => setRephraseModalOpen(true)}
                disabled={!finalMessage.trim()}
                className="px-3.5 py-2 rounded-xl bg-purple-950 border border-purple-700 text-purple-200 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-900 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>REPHRASE WITH AI</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold/90 mb-2 uppercase tracking-wider">
                FINAL LETTER FOR {name.toUpperCase() || "SISTER"}
              </label>
              <textarea
                rows={6}
                value={finalMessage}
                onChange={(e) => setFinalMessage(e.target.value)}
                placeholder="Write your heartfelt message here..."
                className="w-full p-4 rounded-xl bg-black border border-gold/40 text-white font-serif leading-relaxed focus:border-gold focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="py-4 px-6 rounded-xl bg-black border border-white/20 text-white font-bold text-sm cursor-pointer"
            >
              BACK
            </button>
            <button
              onClick={() => {
                setStep(3);
                if (finalMessage.trim()) handleRunAI();
              }}
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #F4E091 50%, #AA820A 100%)",
              }}
              className="flex-1 py-4 rounded-2xl text-black font-extrabold text-sm tracking-wider shadow-xl shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer border border-goldlight"
            >
              <span>NEXT: RUN AI PERSONALIZATION</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: AI Personalization & Review */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-[#14121B] border border-gold/30 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini 2.5 Flash</span>
                </div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-gold" /> Step 3: AI Personalization
                </h2>
              </div>

              <button
                onClick={handleRunAI}
                disabled={aiAnalyzing}
                className="px-4 py-2.5 rounded-xl bg-black border border-gold/50 text-gold text-xs font-bold flex items-center gap-2 hover:bg-gold/10 cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>{aiAnalyzing ? "Analyzing..." : "RE-RUN GEMINI AI"}</span>
              </button>
            </div>

            {/* AI Breakdown Badge */}
            {aiResult && (
              <div className="p-4 rounded-2xl bg-gold/10 border border-gold/40 space-y-2 text-xs text-goldlight">
                <div className="font-bold text-white uppercase tracking-wider text-xs">
                  Detected Emotion & Mood:
                </div>
                <div className="flex flex-wrap gap-2 text-sm font-bold text-gold">
                  <span className="bg-black/60 px-3 py-1 rounded-lg border border-gold/30">Mood: {aiResult.mood}</span>
                  <span className="bg-black/60 px-3 py-1 rounded-lg border border-gold/30">Tone: {aiResult.tone}</span>
                  <span className="bg-black/60 px-3 py-1 rounded-lg border border-gold/30">Visual: {aiResult.visualDirection}</span>
                </div>
                {aiResult.reasoning && (
                  <p className="italic text-gray-300 font-serif pt-1">&ldquo;{aiResult.reasoning}&rdquo;</p>
                )}
              </div>
            )}

            {/* Selection Overrides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Theme Dropdown */}
              <div className="space-y-2 bg-black/60 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase">
                  <Palette className="w-4 h-4" />
                  <span>Theme</span>
                </div>
                <select
                  value={themeId}
                  onChange={(e) => setThemeId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border border-gold/40 text-white font-bold text-xs focus:outline-none focus:border-gold"
                >
                  {themes.map((th) => (
                    <option key={th.id} value={th.id}>
                      {th.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Song Dropdown */}
              <div className="space-y-2 bg-black/60 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase">
                  <Music className="w-4 h-4" />
                  <span>Song</span>
                </div>
                <select
                  value={songId}
                  onChange={(e) => setSongId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border border-gold/40 text-white font-bold text-xs focus:outline-none focus:border-gold"
                >
                  {songs.map((sg) => (
                    <option key={sg.id} value={sg.id}>
                      {sg.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Motion Dropdown */}
              <div className="space-y-2 bg-black/60 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-gold uppercase">
                  <Sliders className="w-4 h-4" />
                  <span>Motion</span>
                </div>
                <select
                  value={motionStyle}
                  onChange={(e) => setMotionStyle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border border-gold/40 text-white font-bold text-xs focus:outline-none focus:border-gold"
                >
                  <option value="slow_emotional">Slow & Emotional</option>
                  <option value="playful_bounce">Playful Bounce</option>
                  <option value="dramatic_zoom">Dramatic Zoom</option>
                  <option value="elegant_fade">Elegant Soft Fade</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gold/90 mb-2 uppercase tracking-wider">
                CUSTOM 6-DIGIT CODE (OPTIONAL - LEAVE BLANK TO AUTO-GENERATE)
              </label>
              <input
                type="text"
                maxLength={6}
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 280826"
                className="w-full p-4 rounded-xl bg-black border border-gold/40 text-white font-mono text-center tracking-widest text-xl font-bold focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="py-4 px-6 rounded-xl bg-black border border-white/20 text-white font-bold text-sm cursor-pointer"
            >
              BACK
            </button>
            <button
              onClick={handleCreateSister}
              disabled={submitting}
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #F4E091 50%, #AA820A 100%)",
              }}
              className="flex-1 py-4 rounded-2xl text-black font-extrabold text-sm tracking-wider shadow-xl shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer border border-goldlight"
            >
              <CheckCircle className="w-5 h-5 text-black" />
              <span>{submitting ? "CREATING EXPERIENCE..." : "ACCEPT & CREATE EXPERIENCE"}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 4: Success & Share Code */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
          <div className="bg-[#14121B] border border-gold/40 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="p-4 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 w-16 h-16 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>

            <h2 className="font-serif text-3xl font-bold text-white">
              Experience Created for {name}! ❤️
            </h2>

            <div className="p-6 rounded-2xl bg-black border-2 border-gold/50 space-y-3 shadow-inner">
              <div className="text-xs uppercase text-gold font-bold tracking-widest">
                SECRET ACCESS CODE
              </div>
              <div className="font-mono text-4xl sm:text-5xl font-bold text-white tracking-widest">
                {generatedCode}
              </div>
              <p className="text-xs text-gray-300">
                Share this code with {name}. Keep it private!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `🎀 I made a special surprise for you for Raksha Bandhan!\nOpen: ${window.location.origin}/rakhi\nSecret Code: ${generatedCode}`
                  );
                  alert("Share message copied!");
                }}
                className="flex-1 py-3.5 rounded-xl bg-black border border-gold text-gold font-bold text-xs hover:bg-gold/20 cursor-pointer"
              >
                COPY SHARE MESSAGE
              </button>

              <button
                onClick={() => router.push(`/rakhi/admin/sisters/${createdSister?.id}/questions`)}
                style={{
                  background: "linear-gradient(135deg, #D4AF37 0%, #F4E091 50%, #AA820A 100%)",
                }}
                className="flex-1 py-3.5 rounded-xl text-black font-extrabold text-xs shadow-md border border-goldlight cursor-pointer"
              >
                ADD QUESTIONS NOW →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Rephrase Modal */}
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
