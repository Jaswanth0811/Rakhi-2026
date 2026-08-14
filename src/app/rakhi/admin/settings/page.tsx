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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-cream">System Settings</h1>
        <p className="text-sm text-goldlight/70">
          General preferences, security configuration, and Gemini AI key setup.
        </p>
      </div>

      <div className="bg-[#16141D] border border-gold/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-cream flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-gold" /> AI Personalization Settings
          </h3>
          <div className="p-4 rounded-xl bg-[#0E0D12] border border-gold/20 text-xs text-goldlight/80 space-y-1">
            <div>Model: Gemini 2.5 Flash</div>
            <div>Status: Configured in environment (.env)</div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gold/10">
          <h3 className="font-serif text-lg font-bold text-cream flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" /> Security Settings
          </h3>
          <div className="p-4 rounded-xl bg-[#0E0D12] border border-gold/20 text-xs text-goldlight/80 space-y-1">
            <div>Admin PIN: 233014</div>
            <div>Access Code Format: 6-Digit Numeric</div>
            <div>Session Expiry: 7 Days</div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-gold via-goldlight to-golddark text-charcoal font-bold text-xs shadow-md cursor-pointer"
        >
          {saved ? "SETTINGS SAVED!" : "SAVE PREFERENCES"}
        </button>
      </div>
    </div>
  );
}
