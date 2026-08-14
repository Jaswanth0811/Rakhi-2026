"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Wand2, Sparkles, Check, RefreshCw } from "lucide-react";
import AIRephraseModal from "@/components/admin/AIRephraseModal";

export default function SisterMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sister, setSister] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  // AI Rephrase Modal state
  const [rephraseModalOpen, setRephraseModalOpen] = useState(false);

  useEffect(() => {
    fetchSister();
  }, [id]);

  const fetchSister = async () => {
    try {
      const res = await fetch(`/api/admin/sisters/${id}`);
      if (res.ok) {
        const json = await res.json();
        setSister(json.sister);
        setMessage(json.sister.finalMessage || "");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sisters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalMessage: message }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!message.trim()) return;
    setAnalyzing(true);

    try {
      const res = await fetch("/api/admin/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sisterId: id, message }),
      });
      const json = await res.json();
      if (res.ok) {
        setAiResult(json.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/rakhi/admin/sisters/${id}`}
            className="p-2.5 rounded-xl bg-white border border-rose-200 text-gray-700 hover:text-gray-900 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              Final Letter — {sister?.name}
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              Write and edit the personal message revealed in the climax digital letter.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRephraseModalOpen(true)}
            disabled={!message.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-300 text-purple-900 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs hover:bg-purple-100 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-purple-700" />
            <span>REPHRASE WITH AI</span>
          </button>

          <button
            onClick={handleAnalyzeWithAI}
            disabled={analyzing || !message.trim()}
            className="px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-[#E07A5F] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-rose-50"
          >
            <Wand2 className="w-4 h-4 text-[#E07A5F]" />
            <span>{analyzing ? "ANALYZING..." : "AI ANALYZE"}</span>
          </button>
        </div>
      </div>

      {aiResult && (
        <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs text-purple-900 shadow-xs">
          <div className="font-bold text-purple-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-700" /> Gemini 2.5 Flash Emotional Analysis
          </div>
          <div>
            <strong>Mood:</strong> {aiResult.mood} • <strong>Tone:</strong> {aiResult.tone}
          </div>
          <div>
            <strong>Recommended Theme:</strong> {aiResult.generatedTheme?.name || aiResult.recommendedThemeId} •{" "}
            <strong>Motion:</strong> {aiResult.motionStyle}
          </div>
          <p className="italic text-purple-800 pt-1 font-serif">&ldquo;{aiResult.reasoning}&rdquo;</p>
        </div>
      )}

      <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 space-y-4 shadow-md">
        <textarea
          rows={12}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Dear sister..."
          className="w-full p-5 rounded-2xl bg-rose-50/50 border border-rose-200 text-gray-900 font-serif text-base sm:text-lg font-bold leading-relaxed focus:border-[#E07A5F] focus:outline-none resize-none shadow-inner"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500 font-mono font-bold">
            {message.length} characters
          </span>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="px-6 py-3.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md border border-rose-200"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>SAVED!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>{saving ? "SAVING..." : "SAVE LETTER"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <AIRephraseModal
        isOpen={rephraseModalOpen}
        sisterName={sister?.name || "Sister"}
        originalMessage={message}
        onClose={() => setRephraseModalOpen(false)}
        onApply={(rephrased) => setMessage(rephrased)}
      />
    </div>
  );
}
