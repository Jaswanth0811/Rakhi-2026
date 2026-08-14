"use client";

import { useRouter } from "next/navigation";
import { User, LogOut, ShieldCheck } from "lucide-react";

export default function AdminProfilePage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/rakhi/admin");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-cream">Admin Profile</h1>
        <p className="text-sm text-goldlight/70">
          Account details and session management.
        </p>
      </div>

      <div className="bg-[#16141D] border border-gold/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-center">
        <div className="p-4 rounded-full bg-gold/10 border border-gold/30 text-gold w-16 h-16 mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-cream">Brother (Admin)</h2>
          <p className="text-xs text-goldlight/60">admin@rakhi2026.com</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E0D12] border border-gold/20 text-xs text-goldlight/80 space-y-2 text-left">
          <div className="flex justify-between">
            <span>Role:</span>
            <span className="font-bold text-gold">Super Admin</span>
          </div>
          <div className="flex justify-between">
            <span>Authentication Method:</span>
            <span className="font-mono text-gold">6-Digit PIN (233014)</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-900 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>LOG OUT OF ADMIN</span>
        </button>
      </div>
    </div>
  );
}
