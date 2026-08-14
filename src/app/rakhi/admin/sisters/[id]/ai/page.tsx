"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  Music,
  Palette,
  Zap,
  ArrowLeft,
  RefreshCw,
  Sliders,
  ExternalLink,
  Upload,
} from "lucide-react";

interface AIPageProps {
  params: Promise<{ id: string }>;
}

export default function SisterAIPage({ params }: AIPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [sister, setSister] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  // Custom Audio State
  const [customAudioUrl, setCustomAudioUrl] = useState("");
  const [customSongTitle, setCustomSongTitle] = useState("");
  const [selectedMotion, setSelectedMotion] = useState("slow_emotional");
  const [submittingAudio, setSubmittingAudio] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const sisRes = await fetch(`/api/admin/sisters/${id}`);

      if (sisRes.ok) {
        const sisData = await sisRes.json();
        setSister(sisData.sister);
        setSelectedMotion(sisData.sister.motionStyle || "slow_emotional");

        if (sisData.recommendations && sisData.recommendations.length > 0) {
          const latest = sisData.recommendations[0];
          try {
            const parsed = JSON.parse(latest.aiResponse);
            setAnalysisResult(parsed);
          } catch {
            // Ignore
          }
        }
      }
    } catch (e) {
      console.error("Error fetching AI page data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAIAnalysis = async () => {
    if (!sister || !sister.finalMessage) {
      alert("Please write a personal final message for this sister first in Sister Settings!");
      return;
    }

    try {
      setAnalyzing(true);
      setApplySuccess(false);

      const res = await fetch("/api/admin/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sisterId: sister.id,
          message: sister.finalMessage,
        }),
      });

      if (!res.ok) {
        throw new Error("AI analysis failed.");
      }

      const data = await res.json();
      setAnalysisResult(data.analysis);

      if (data.analysis.motionStyle) {
        setSelectedMotion(data.analysis.motionStyle);
      }

      // Re-fetch sister to update newly created AI theme
      fetchData();
    } catch (e) {
      console.error(e);
      alert("AI Analysis encountered an issue. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveCustomAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAudioUrl.trim() || !customSongTitle.trim()) {
      alert("Please enter both song title and audio URL.");
      return;
    }

    setSubmittingAudio(true);
    try {
      // Create new song record in DB
      const res = await fetch("/api/admin/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: customSongTitle.trim(),
          artist: "My Choice",
          mood: "Custom Choice",
          audioUrl: customAudioUrl.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.song) {
        // Assign newly uploaded/linked song to sister
        await fetch(`/api/admin/sisters/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            songId: data.song.id,
          }),
        });

        setCustomAudioUrl("");
        setCustomSongTitle("");
        setApplySuccess(true);
        setTimeout(() => setApplySuccess(false), 4000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save custom song choice.");
    } finally {
      setSubmittingAudio(false);
    }
  };

  const handleApplySettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/sisters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motionStyle: selectedMotion,
        }),
      });

      if (res.ok) {
        setApplySuccess(true);
        setTimeout(() => setApplySuccess(false), 4000);
      }
    } catch (e) {
      console.error("Error saving AI settings:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !sister) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-700 font-bold">Loading AI Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 pb-24 text-gray-900">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => router.push(`/rakhi/admin/sisters/${id}`)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {sister?.name || "Sister"} Overview</span>
        </button>

        <button
          onClick={() => router.push(`/rakhi/admin/sisters/${id}/preview`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-[#E07A5F] text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer shadow-xs"
        >
          <span>LIVE PREVIEW EXPERIENCE</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-rose-200 p-6 sm:p-8 shadow-md">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-pink-100 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 2.5 Flash Custom Engine</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
              Personalized AI Creation for <span className="text-[#E07A5F]">{sister?.name}</span>
            </h1>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              Gemini 2.5 Flash analyzes your letter to dynamically create a <strong>unique light theme</strong> for {sister?.name} and suggests BGM music recommendations from all over the internet for you to choose from!
            </p>
          </div>

          <button
            onClick={handleRunAIAnalysis}
            disabled={analyzing}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="shrink-0 px-6 py-4 rounded-2xl text-white font-extrabold text-sm tracking-wider shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span>GENERATING LIGHT THEME...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-white fill-white" />
                <span>GENERATE UNIQUE LIGHT THEME</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sister Final Message Preview */}
      <div className="bg-white border border-rose-200 rounded-2xl p-5 space-y-2 shadow-xs">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Message Analyzed by Gemini AI:
        </h4>
        <p className="text-sm text-gray-900 italic font-serif font-semibold bg-rose-50 p-4 rounded-xl border border-rose-200 whitespace-pre-wrap">
          {sister?.finalMessage || "No message set yet. Please add a message in sister settings!"}
        </p>
      </div>

      {/* AI Recommendation Results Section */}
      {analysisResult ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-gray-900">
              <Sparkles className="w-6 h-6 text-[#E07A5F]" />
              <span>AI Generated Theme & BGM Suggestions</span>
            </h2>
            {applySuccess && (
              <span className="text-xs font-bold text-green-800 bg-green-50 border border-green-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Saved & Applied!</span>
              </span>
            )}
          </div>

          {/* DYNAMIC AI GENERATED THEME CARD */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-[#E07A5F]">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#E07A5F] tracking-widest">
                    Unique Custom Light Theme Created for {sister?.name}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-gray-900">
                    {analysisResult.generatedTheme?.name || "Soft Rose Pearl Glow"}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full self-start sm:self-auto">
                ✓ Active Light Theme for {sister?.name}
              </span>
            </div>

            <p className="text-sm text-gray-800 italic font-serif font-semibold leading-relaxed bg-rose-50 p-4 rounded-2xl border border-rose-200">
              &ldquo;{analysisResult.generatedTheme?.description}&rdquo;
            </p>

            {/* Live Color Swatches */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                AI Generated Light Color Palette:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200 text-center space-y-2">
                  <div
                    className="w-10 h-10 rounded-full mx-auto shadow-sm border border-white"
                    style={{ backgroundColor: analysisResult.generatedTheme?.primaryColor || "#E07A5F" }}
                  />
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Primary</div>
                  <div className="text-xs font-mono font-bold text-gray-900">{analysisResult.generatedTheme?.primaryColor}</div>
                </div>

                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200 text-center space-y-2">
                  <div
                    className="w-10 h-10 rounded-full mx-auto shadow-sm border border-white"
                    style={{ backgroundColor: analysisResult.generatedTheme?.secondaryColor || "#F4ACB7" }}
                  />
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Secondary</div>
                  <div className="text-xs font-mono font-bold text-gray-900">{analysisResult.generatedTheme?.secondaryColor}</div>
                </div>

                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200 text-center space-y-2">
                  <div
                    className="w-10 h-10 rounded-full mx-auto shadow-sm border border-white"
                    style={{ backgroundColor: analysisResult.generatedTheme?.accentColor || "#D97706" }}
                  />
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Accent</div>
                  <div className="text-xs font-mono font-bold text-gray-900">{analysisResult.generatedTheme?.accentColor}</div>
                </div>

                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200 text-center space-y-2">
                  <div
                    className="w-10 h-10 rounded-full mx-auto shadow-sm border border-white"
                    style={{ backgroundColor: analysisResult.generatedTheme?.particleColor || "#F4ACB7" }}
                  />
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Particles</div>
                  <div className="text-xs font-mono font-bold text-gray-900">{analysisResult.generatedTheme?.particleColor}</div>
                </div>

                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200 text-center space-y-2">
                  <div
                    className="w-10 h-10 rounded-full mx-auto shadow-sm border border-white"
                    style={{ backgroundColor: analysisResult.generatedTheme?.backgroundColor || "#FAF8F5" }}
                  />
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Background</div>
                  <div className="text-xs font-mono font-bold text-gray-900">{analysisResult.generatedTheme?.backgroundColor}</div>
                </div>

                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-200 text-center space-y-2">
                  <div
                    className="w-10 h-10 rounded-full mx-auto shadow-sm border border-white"
                    style={{ backgroundColor: analysisResult.generatedTheme?.cardBackground || "#FFFFFF" }}
                  />
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Card Backing</div>
                  <div className="text-xs font-mono font-bold text-gray-900">{analysisResult.generatedTheme?.cardBackground}</div>
                </div>
              </div>
            </div>
          </div>

          {/* INTERNET BGM RECOMMENDATIONS (LISTEN ONLINE) */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            <div className="flex items-center gap-3 border-b border-rose-200 pb-4">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-[#E07A5F]">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900">
                  Internet BGM Recommendations for {sister?.name}
                </h3>
                <p className="text-xs text-gray-600 font-semibold">
                  Gemini searched instrumental scores & BGMs from across the web. Click below to listen online on YouTube and decide!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analysisResult.recommendedSongs?.map((songRec: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-[#E07A5F] transition-all shadow-xs"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-[#E07A5F] uppercase tracking-wider bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Option {idx + 1} • {songRec.language}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-gray-900">{songRec.title}</h4>
                    <p className="text-xs text-gray-700 font-extrabold">{songRec.artist}</p>
                    <p className="text-xs text-gray-600 italic pt-1 font-serif font-semibold">&ldquo;{songRec.reason}&rdquo;</p>
                  </div>

                  <a
                    href={songRec.searchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-white border border-rose-300 text-[#E07A5F] text-xs font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>LISTEN ONLINE ON YOUTUBE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* UPLOAD / CUSTOM AUDIO CHOICE FORM */}
            <div className="border-t border-rose-200 pt-6 space-y-4">
              <h4 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#E07A5F]" />
                <span>Upload or Paste Your Chosen Music</span>
              </h4>
              <p className="text-xs text-gray-600 font-semibold">
                After listening online, paste your MP3 link / audio URL below to set it for {sister?.name}:
              </p>

              <form onSubmit={handleSaveCustomAudio} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={customSongTitle}
                  onChange={(e) => setCustomSongTitle(e.target.value)}
                  placeholder="Song Title (e.g. Phoolon Ka Taron Ka Flute BGM)"
                  className="p-3.5 rounded-xl bg-white border border-rose-300 text-gray-900 text-xs font-bold focus:border-[#E07A5F] focus:outline-none"
                />

                <input
                  type="url"
                  value={customAudioUrl}
                  onChange={(e) => setCustomAudioUrl(e.target.value)}
                  placeholder="Audio MP3 Link (https://...)"
                  className="p-3.5 rounded-xl bg-white border border-rose-300 text-gray-900 text-xs font-mono focus:border-[#E07A5F] focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={submittingAudio}
                  style={{
                    background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
                  }}
                  className="py-3.5 rounded-xl text-white font-extrabold text-xs tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer border border-rose-200"
                >
                  {submittingAudio ? "SAVING MUSIC..." : "SET THIS MUSIC FOR SISTER"}
                </button>
              </form>
            </div>
          </div>

          {/* MOTION STYLE CONTROL */}
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-[#E07A5F]">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-gray-900">Cinematic Motion Style</h3>
                  <p className="text-xs text-gray-600 font-semibold">Card entrance speeds and spring physics</p>
                </div>
              </div>

              <select
                value={selectedMotion}
                onChange={(e) => {
                  setSelectedMotion(e.target.value);
                  handleApplySettings();
                }}
                className="p-3 rounded-xl bg-white border border-rose-300 text-gray-900 font-bold text-xs focus:outline-none focus:border-[#E07A5F]"
              >
                <option value="slow_emotional">Slow & Emotional (Smooth blur transitions)</option>
                <option value="playful_bounce">Playful & Bouncy (Spring physics)</option>
                <option value="dramatic_zoom">Dramatic Zoom (High contrast scale)</option>
                <option value="elegant_fade">Elegant Soft Fade (Minimalist flow)</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center space-y-4 shadow-sm">
          <div className="p-4 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] inline-block">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-900">
            Ready to generate AI Custom Light Theme & BGM suggestions?
          </h3>
          <p className="text-sm text-gray-700 font-semibold max-w-md mx-auto">
            Click the <strong className="text-[#E07A5F]">&ldquo;GENERATE UNIQUE LIGHT THEME&rdquo;</strong> button above to let Gemini 2.5 Flash create a custom theme for {sister?.name}.
          </p>
        </div>
      )}
    </div>
  );
}
