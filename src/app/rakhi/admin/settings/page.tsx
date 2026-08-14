"use client";

import { useState } from "react";
import { Settings, Shield, Wand2, Music, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-gray-900">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-600 font-semibold">
          General preferences, security configuration, and Gemini AI key setup.
        </p>
      </div>

      <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[#E07A5F]" /> AI Personalization Settings
          </h3>
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-gray-800 font-bold space-y-1">
            <div>Model: Gemini 2.5 Flash</div>
            <div>Status: Configured in environment (.env)</div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-rose-200">
          <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#E07A5F]" /> Security Settings
          </h3>
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-gray-800 font-bold space-y-1">
            <div>Admin PIN: 233014</div>
            <div>Access Code Format: 6-Digit Numeric</div>
            <div>Session Expiry: 7 Days</div>
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="w-full py-4 rounded-xl text-white font-extrabold text-xs shadow-md cursor-pointer border border-rose-200"
        >
          {saved ? "SETTINGS SAVED!" : "SAVE PREFERENCES"}
        </button>
      </div>
    </div>
  );
}
