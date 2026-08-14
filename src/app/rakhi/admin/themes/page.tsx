"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeLibraryPage() {
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const res = await fetch("/api/admin/themes");
      if (res.ok) {
        const json = await res.json();
        setThemes(json.themes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#E07A5F]">
        <div className="w-8 h-8 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Theme Library</h1>
        <p className="text-sm text-gray-600 font-semibold">
          Visual light theme presets controlling colors, gradients, card styling, and stardust atmosphere.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {themes.map((theme) => {
          let config: any = {};
          try {
            config = JSON.parse(theme.configuration);
          } catch {
            // ignore
          }

          return (
            <div
              key={theme.id}
              className="bg-white border-2 border-rose-200 rounded-3xl p-5 space-y-4 shadow-md overflow-hidden hover:border-[#E07A5F] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-rose-200 bg-rose-50">
                  {theme.previewImage ? (
                    <Image
                      src={theme.previewImage}
                      alt={theme.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full ${config.background || "bg-rose-50"}`}
                    />
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">{theme.name}</h3>
                  <p className="text-xs text-gray-600 font-medium line-clamp-2">{theme.description}</p>
                </div>
              </div>

              {/* Color Swatch */}
              <div className="flex items-center gap-2 pt-3 border-t border-rose-200 text-xs">
                <span className="text-[10px] text-gray-500 font-bold uppercase">ACCENT:</span>
                <span
                  className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                  style={{ backgroundColor: config.accent || "#E07A5F" }}
                />
                <span className="font-mono text-xs text-gray-900 font-bold">{config.accent || "#E07A5F"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
