"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Sparkles, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      router.push("/rakhi/admin/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-pink-200/50 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white border-2 border-rose-200 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-4 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#E07A5F] font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" /> Rakhi 2026 Admin
          </span>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Admin Control</h1>
          <p className="text-xs text-gray-600 font-semibold">
            Enter your 6-digit Admin Security PIN to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
              6-DIGIT ADMIN PIN
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setError(null);
                  setPin(e.target.value.replace(/[^0-9]/g, ""));
                }}
                placeholder="••••••"
                className="w-full py-3.5 px-4 pl-11 rounded-xl bg-rose-50/50 border border-rose-300 focus:border-[#E07A5F] text-gray-900 placeholder-gray-400 tracking-widest font-mono text-center text-xl focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50 border border-rose-300 p-3 rounded-xl font-bold"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || pin.length < 6}
            style={
              pin.length >= 6 && !loading
                ? {
                    background:
                      "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
                  }
                : {}
            }
            className={`w-full py-4 rounded-xl font-extrabold tracking-wider text-sm transition-all shadow-md ${
              pin.length >= 6 && !loading
                ? "text-white hover:scale-[1.02] active:scale-[0.98] border border-rose-200 cursor-pointer"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
            }`}
          >
            {loading ? "Authenticating..." : "ACCESS DASHBOARD"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
