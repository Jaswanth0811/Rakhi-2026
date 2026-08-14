"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

interface MusicPlayerProps {
  songUrl?: string | null;
  songTitle?: string | null;
  artist?: string | null;
}

export default function MusicPlayer({ songUrl, songTitle, artist }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!songUrl) return;

    const audio = new Audio(songUrl);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Enable play on first user interaction anywhere on screen
    const handleFirstInteraction = () => {
      if (audioRef.current && isMuted) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsMuted(false);
          })
          .catch((e) => console.log("Autoplay prevented:", e));
      }
      window.removeEventListener("pointerdown", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [songUrl]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isPlaying && !isMuted) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch((e) => console.log("Playback error:", e));
    }
  };

  if (!songUrl) return null;

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2.5">
      {/* Light Theme Track Info Badge & Visualizer */}
      {isPlaying && !isMuted && (
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xl px-3.5 py-2 rounded-full border border-rose-200 text-gray-900 shadow-md">
          <Music className="w-3.5 h-3.5 text-[#E07A5F] animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="font-bold text-[11px] truncate max-w-[100px] sm:max-w-[140px] text-gray-900">
              {songTitle || "BGM Theme"}
            </span>
            <span className="text-[9px] text-[#E07A5F] font-semibold truncate max-w-[100px] sm:max-w-[140px]">
              {artist || "Instrumental Score"}
            </span>
          </div>

          {/* Equalizer Bar Animation */}
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-0.5 h-3 bg-[#E07A5F] rounded-full animate-bounce" />
            <span className="w-0.5 h-4 bg-[#D97706] rounded-full animate-bounce delay-100" />
            <span className="w-0.5 h-2 bg-[#E07A5F] rounded-full animate-bounce delay-200" />
          </div>
        </div>
      )}

      {/* Light Floating Mute/Unmute Touch Toggle Button */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute Music" : "Mute Music"}
        className="relative group p-3 rounded-full bg-white/95 border-2 border-rose-200 text-[#E07A5F] shadow-md backdrop-blur-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 opacity-75 group-hover:opacity-100" />
        ) : (
          <Volume2 className="w-5 h-5 text-[#E07A5F] animate-pulse" />
        )}
        {!isMuted && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07A5F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E07A5F]"></span>
          </span>
        )}
      </button>
    </div>
  );
}
