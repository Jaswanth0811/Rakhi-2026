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
    <div className="max-w-xl mx-auto space-y-6 text-gray-900">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-sm text-gray-600 font-semibold">
          Account details and session management.
        </p>
      </div>

      <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md text-center">
        <div className="p-4 rounded-full bg-rose-50 border border-rose-200 text-[#E07A5F] w-16 h-16 mx-auto flex items-center justify-center shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-gray-900">Brother (Admin)</h2>
          <p className="text-xs text-gray-600 font-semibold">admin@rakhi2026.com</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-gray-800 font-bold space-y-2 text-left shadow-inner">
          <div className="flex justify-between">
            <span>Role:</span>
            <span className="font-bold text-[#E07A5F]">Super Admin</span>
          </div>
          <div className="flex justify-between">
            <span>Authentication Method:</span>
            <span className="font-mono text-[#E07A5F]">6-Digit PIN (233014)</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-all cursor-pointer shadow-xs"
        >
          <LogOut className="w-4 h-4 text-rose-700" />
          <span>LOG OUT OF ADMIN</span>
        </button>
      </div>
    </div>
  );
}
