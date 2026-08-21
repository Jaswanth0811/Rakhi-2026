"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, RefreshCw, Copy, Check, Calendar } from "lucide-react";

export default function SisterSecurityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sister, setSister] = useState<any | null>(null);
  const [birthDay, setBirthDay] = useState("28");
  const [birthMonth, setBirthMonth] = useState("08");
  const [revealedCode, setRevealedCode] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
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
        if (json.sister?.customAccessCode && json.sister.customAccessCode.length === 4) {
          setRevealedCode(json.sister.customAccessCode);
          setBirthDay(json.sister.customAccessCode.slice(0, 2));
          setBirthMonth(json.sister.customAccessCode.slice(2, 4));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const computedCode = `${birthDay.padStart(2, "0")}${birthMonth.padStart(2, "0")}`;

  const handleUpdateDDMMCode = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/sisters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customAccessCode: computedCode }),
      });
      if (res.ok) {
        setRevealedCode(computedCode);
        alert(`Passcode updated to ${computedCode} (DDMM) successfully!`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/rakhi` : "/rakhi";

  const activeCode = revealedCode || computedCode;

  const shareText = `🎀 I made something special for you for Raksha Bandhan!\n\nOpen this link:\n${publicUrl}\n\nYour Birthday Passcode (DDMM):\n${activeCode} (Enter your Birthday DD & MM)\n\nDon't share your code. ❤️`;

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
            4-Digit DDMM Birthday Passcode — {sister?.name}
          </h1>
          <p className="text-xs text-gray-600 font-semibold">
            Manage the 4-digit birthday passcode (DDMM order) and copy personalized share message.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md text-center">
        <div className="p-4 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] w-16 h-16 mx-auto flex items-center justify-center shadow-xs">
          <KeyRound className="w-8 h-8 text-[#E07A5F]" />
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase text-[#E07A5F] font-black tracking-widest flex items-center justify-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#E07A5F]" /> 4-DIGIT BIRTHDAY PASSCODE (DDMM)
          </div>
          <div className="font-mono text-4xl sm:text-5xl font-extrabold text-[#E07A5F] tracking-widest">
            {activeCode}
          </div>
          <p className="text-xs text-gray-600 font-bold">
            Passcode is formed by Day ({activeCode.slice(0, 2)}) and Month ({activeCode.slice(2, 4)}).
          </p>
        </div>

        {/* DDMM Birthday Selector Form */}
        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3 text-left">
          <label className="block text-xs font-black uppercase text-gray-700 tracking-wider">
            UPDATE BIRTHDAY DATE & MONTH (DDMM)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Birth Day (DD)</span>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-rose-200 text-gray-900 font-mono font-bold text-sm"
              >
                {Array.from({ length: 31 }, (_, i) => {
                  const val = String(i + 1).padStart(2, "0");
                  return (
                    <option key={val} value={val}>
                      Day {val}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-600 uppercase">Birth Month (MM)</span>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-rose-200 text-gray-900 font-mono font-bold text-sm"
              >
                {[
                  "01 (Jan)",
                  "02 (Feb)",
                  "03 (Mar)",
                  "04 (Apr)",
                  "05 (May)",
                  "06 (Jun)",
                  "07 (Jul)",
                  "08 (Aug)",
                  "09 (Sep)",
                  "10 (Oct)",
                  "11 (Nov)",
                  "12 (Dec)",
                ].map((monthStr, idx) => {
                  const val = String(idx + 1).padStart(2, "0");
                  return (
                    <option key={val} value={val}>
                      Month {monthStr}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            onClick={handleUpdateDDMMCode}
            disabled={updating}
            className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm border border-rose-400"
          >
            <RefreshCw className={`w-4 h-4 text-white ${updating ? "animate-spin" : ""}`} />
            <span>{updating ? "SAVING..." : `SET PASSCODE TO ${computedCode} (DDMM)`}</span>
          </button>
        </div>

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
