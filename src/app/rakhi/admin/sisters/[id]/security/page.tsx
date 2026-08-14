"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, RefreshCw, Copy, Check } from "lucide-react";

export default function SisterSecurityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sister, setSister] = useState<any | null>(null);
  const [revealedCode, setRevealedCode] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSister();
  }, [id]);

  const fetchSister = async () => {
    try {
      const res = await fetch(`/api/admin/sisters/${id}`);
      if (res.ok) {
        const json = await res.json();
        setSister(json.sister);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegenerateCode = async () => {
    if (
      !confirm(
        `Regenerating a new code will invalidate the previous code for ${sister?.name}. Continue?`
      )
    )
      return;

    setRegenerating(true);
    try {
      const res = await fetch("/api/admin/access-code/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sisterId: id }),
      });
      const json = await res.json();
      if (res.ok && json.newCode) {
        setRevealedCode(json.newCode);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegenerating(false);
    }
  };

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/rakhi` : "/rakhi";

  const shareText = `🎀 I made something special for you for Raksha Bandhan!\n\nOpen this link:\n${publicUrl}\n\nYour Secret Code:\n${
    revealedCode || "•••••• (Generate or enter code)"
  }\n\nDon't share your code. ❤️`;

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-gray-900">
      <div className="flex items-center gap-3">
        <Link
          href={`/rakhi/admin/sisters/${id}`}
          className="p-2.5 rounded-xl bg-white border border-rose-200 text-gray-700 hover:text-gray-900 shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Security & Access Code — {sister?.name}
          </h1>
          <p className="text-xs text-gray-600 font-semibold">
            Generate 6-digit access code and copy personalized share message.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md text-center">
        <div className="p-4 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] w-16 h-16 mx-auto flex items-center justify-center shadow-xs">
          <KeyRound className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase text-[#E07A5F] font-black tracking-widest">
            SECRET ACCESS CODE
          </div>
          <div className="font-mono text-4xl sm:text-5xl font-extrabold text-[#E07A5F] tracking-widest">
            {revealedCode || "••••••"}
          </div>
          <p className="text-xs text-gray-600 font-bold">
            {revealedCode
              ? "This code is active and ready for use!"
              : "Code is securely hashed in the database."}
          </p>
        </div>

        <button
          onClick={handleRegenerateCode}
          disabled={regenerating}
          className="w-full py-4 rounded-xl bg-rose-50 border border-rose-300 text-gray-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 text-[#E07A5F] ${regenerating ? "animate-spin" : ""}`} />
          <span>{regenerating ? "GENERATING..." : "GENERATE NEW SECRET CODE"}</span>
        </button>

        <div className="pt-4 border-t border-rose-200 text-left space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            SHARE MESSAGE FOR {sister?.name ? sister.name.toUpperCase() : "SISTER"}
          </label>
          <textarea
            rows={5}
            readOnly
            value={shareText}
            className="w-full p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-gray-900 font-mono text-xs font-bold leading-relaxed resize-none focus:outline-none shadow-inner"
          />

          <button
            onClick={() => {
              navigator.clipboard.writeText(shareText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            style={{
              background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
            }}
            className="w-full py-3.5 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer border border-rose-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white" />
                <span>COPY SHARE MESSAGE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
