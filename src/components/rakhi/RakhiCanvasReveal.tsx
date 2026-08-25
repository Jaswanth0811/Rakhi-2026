"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface RakhiCanvasRevealProps {
  sisterName: string;
  onNext: () => void;
}

interface BalloonData {
  id: number;
  left: number; // percentage
  size: number;
  color: string;
  highlight: string;
  duration: number; // seconds
  delay: number; // seconds
  popped: boolean;
}

const BALLOON_PALETTES = [
  { color: "#FF4B72", highlight: "#FFA3B8" }, // Vibrant Pink
  { color: "#E07A5F", highlight: "#F8C5B8" }, // Terracotta
  { color: "#FF85A1", highlight: "#FFCCD7" }, // Soft Rose
  { color: "#FB8500", highlight: "#FFD199" }, // Amber Orange
  { color: "#FFB703", highlight: "#FFE599" }, // Honey Gold
  { color: "#9D4EDD", highlight: "#D8B4F8" }, // Lavender Violet
  { color: "#06D6A0", highlight: "#A3F7E2" }, // Mint Teal
];

export default function RakhiCanvasReveal({ sisterName, onNext }: RakhiCanvasRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [popParticles, setPopParticles] = useState<
    { id: number; x: number; y: number; color: string; symbol: string }[]
  >([]);

  // Fixed floating balloon slots (left and right flanks to keep center clear and 60fps smooth)
  useEffect(() => {
    const slots = [
      { left: 3, delay: 0, dur: 8 },
      { left: 12, delay: 2.5, dur: 10 },
      { left: 20, delay: 1, dur: 9 },
      { left: 75, delay: 0.5, dur: 8.5 },
      { left: 84, delay: 3, dur: 10.5 },
      { left: 93, delay: 1.8, dur: 9 },
    ];

    const initial = slots.map((s, i) => {
      const palette = BALLOON_PALETTES[i % BALLOON_PALETTES.length];
      return {
        id: i + 1,
        left: s.left,
        size: 48 + (i % 3) * 8,
        color: palette.color,
        highlight: palette.highlight,
        duration: s.dur,
        delay: s.delay,
        popped: false,
      };
    });
    setBalloons(initial);
  }, []);

  // Multi-stage celebratory confetti explosion
  const triggerGrandCelebration = useCallback(() => {
    sfx.playFanfare();

    // Central paper burst
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FBBF24", "#FF4B72", "#FFFFFF", "#FFD700"],
      ticks: 180,
      gravity: 0.85,
      scalar: 1.1,
    });

    // Side cannon blasts
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.75 },
        colors: ["#FF4B72", "#FFB703", "#9D4EDD", "#FFFFFF"],
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.75 },
        colors: ["#E07A5F", "#D97706", "#06D6A0", "#FFFFFF"],
      });
    }, 150);
  }, []);

  // 60FPS Balloon Pop Handler
  const handleBalloonPop = (id: number, x: number, y: number, color: string) => {
    sfx.playPop();

    // Spawn 4 fast lightweight particles
    const newParticles = [
      { id: Date.now() + 1, x: x - 15, y: y - 10, color, symbol: "💖" },
      { id: Date.now() + 2, x: x + 15, y: y - 10, color, symbol: "✨" },
      { id: Date.now() + 3, x: x, y: y - 25, color, symbol: "🎉" },
    ];

    setPopParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setPopParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 700);

    confetti({
      particleCount: 20,
      spread: 50,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: [color, "#FFFFFF", "#FFD700"],
      gravity: 0.9,
    });

    // Mark balloon popped and smoothly respawn
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) => (b.id === id ? { ...b, popped: false } : b))
      );
    }, 3000);
  };

  const handleNextStep = () => {
    sfx.playChime();
    onNext();
  };

  // Ultra-optimized 60FPS Canvas Drawing Loop (no expensive shadowBlur)
  useEffect(() => {
    triggerGrandCelebration();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animFrame: number;
    let angle = 0;

    const resize = () => {
      const size = Math.min(window.innerWidth * 0.7, 260);
      canvas.width = size;
      canvas.height = size;
    };

    resize();

    const drawRakhi = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = w * 0.28;

      ctx.clearRect(0, 0, w, h);

      // Thread line
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.strokeStyle = "#E07A5F";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Rotating Mandala Petals
      const petalCount = 12;
      for (let i = 0; i < petalCount; i++) {
        const petalAngle = (i * Math.PI * 2) / petalCount;
        const px = Math.cos(petalAngle) * baseRadius;
        const py = Math.sin(petalAngle) * baseRadius;

        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#E07A5F" : "#D97706";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // Outer Gold Ring
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.75, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#F59E0B";
      ctx.stroke();

      // Inner Core Center
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#991B1B";
      ctx.fill();

      // Star emblem in center
      ctx.font = `${baseRadius * 0.4}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✨", 0, 0);

      ctx.restore();

      angle += 0.012; // Smooth 60fps angular speed
      animFrame = requestAnimationFrame(drawRakhi);
    };

    drawRakhi();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [triggerGrandCelebration]);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900 select-none touch-manipulation">
      {/* Ambient background glow */}
      <div className="absolute w-[350px] h-[350px] sm:w-[550px] sm:h-[550px] rounded-full bg-pink-200/50 blur-[120px] pointer-events-none" />

      {/* HARDWARE ACCELERATED 60FPS CSS STYLES */}
      <style jsx global>{`
        @keyframes floatUp60fps {
          0% {
            transform: translate3d(0, 105vh, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          90% {
            opacity: 0.95;
          }
          100% {
            transform: translate3d(0, -20vh, 0);
            opacity: 0;
          }
        }
        @keyframes heartFloat60fps {
          0% {
            transform: translate3d(0, 105vh, 0) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(0, -15vh, 0) scale(1.1);
            opacity: 0;
          }
        }
        .gpu-balloon {
          will-change: transform;
          animation: floatUp60fps linear infinite;
        }
        .gpu-heart {
          will-change: transform;
          animation: heartFloat60fps linear infinite;
        }
      `}</style>

      {/* FLOATING HEARTS (GPU-Accelerated 60FPS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { left: 6, dur: 7, delay: 0, sym: "💖", sz: 24 },
          { left: 16, dur: 9, delay: 2, sym: "❤️", sz: 20 },
          { left: 25, dur: 8, delay: 4, sym: "💕", sz: 22 },
          { left: 78, dur: 7.5, delay: 1, sym: "✨", sz: 22 },
          { left: 88, dur: 9.5, delay: 3, sym: "💖", sz: 26 },
        ].map((h, i) => (
          <div
            key={i}
            style={{
              left: `${h.left}%`,
              fontSize: `${h.sz}px`,
              animationDuration: `${h.dur}s`,
              animationDelay: `${h.delay}s`,
            }}
            className="absolute gpu-heart select-none drop-shadow-xs"
          >
            {h.sym}
          </div>
        ))}
      </div>

      {/* FLOATING BALLOONS (GPU-Accelerated 60FPS, Clickable) */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {balloons.map((b) =>
          !b.popped ? (
            <div
              key={b.id}
              style={{
                left: `${b.left}%`,
                width: `${b.size}px`,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleBalloonPop(b.id, rect.left + rect.width / 2, rect.top + rect.height / 2, b.color);
              }}
              className="absolute gpu-balloon pointer-events-auto cursor-pointer flex flex-col items-center select-none active:scale-90 transition-transform duration-100 touch-manipulation"
              title="Tap to Pop! 🎈"
            >
              {/* Balloon Body */}
              <div
                style={{
                  width: `${b.size}px`,
                  height: `${b.size * 1.22}px`,
                  borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                  background: `radial-gradient(circle at 35% 30%, ${b.highlight} 0%, ${b.color} 75%, #4a0010 100%)`,
                  boxShadow: `0 6px 14px ${b.color}35`,
                }}
                className="relative"
              >
                {/* Shine Highlight */}
                <div
                  style={{
                    width: `${b.size * 0.22}px`,
                    height: `${b.size * 0.38}px`,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.6)",
                    transform: "rotate(-25deg)",
                  }}
                  className="absolute top-1.5 left-1.5"
                />
              </div>

              {/* Knot */}
              <div
                style={{
                  width: `${b.size * 0.16}px`,
                  height: `${b.size * 0.1}px`,
                  backgroundColor: b.color,
                  clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                }}
                className="-mt-0.5"
              />

              {/* String */}
              <div
                style={{ height: `${b.size * 0.65}px` }}
                className="w-[1px] bg-gray-400/70 -mt-0.5"
              />
            </div>
          ) : null
        )}

        {/* Pop Particle Bursts */}
        <AnimatePresence>
          {popParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 1.4, opacity: 1, x: p.x, y: p.y }}
              animate={{
                scale: [1.4, 0.4],
                opacity: [1, 0],
                y: p.y - 35,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="fixed pointer-events-none text-xl z-50 drop-shadow-xs"
            >
              {p.symbol}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MAIN RAKHI CEREMONY CARD (Layer 30, High Performance) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-30 pointer-events-auto w-full max-w-md bg-white/95 border-2 border-rose-200/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_20px_50px_rgba(224,122,95,0.15)] text-center flex flex-col items-center will-change-transform"
      >
        {/* Festive Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-[#E07A5F] text-xs font-black tracking-widest uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Virtual Rakhi Ceremony</span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          Virtual Rakhi Tied By <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] via-[#F4ACB7] to-[#D97706]">
            {sisterName} ❤️
          </span>
        </h2>
        <p className="text-xs text-gray-700 font-bold">
          Your sacred thread of love tied on your brother&apos;s wrist.
        </p>

        {/* 3D Rotating Canvas Rakhi Mandala Emblem */}
        <div
          onClick={() => {
            sfx.playToyPop();
            triggerGrandCelebration();
          }}
          className="relative my-1 cursor-pointer group"
          title="Tap Rakhi for Celebration Explosion! 🎈💖🎊"
        >
          <canvas
            ref={canvasRef}
            className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full drop-shadow-[0_12px_28px_rgba(224,122,95,0.2)] group-hover:scale-105 transition-transform duration-200 active:scale-95"
          />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-[#E07A5F] bg-white px-3 py-1 rounded-full border border-rose-200 whitespace-nowrap shadow-md flex items-center gap-1">
            <span>TAP RAKHI OR BALLOONS TO POP! 🎈💖🎊</span>
          </span>
        </div>

        {/* Sister's Blessing & Pledge */}
        <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1.5 w-full text-center shadow-inner">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#E07A5F] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#E07A5F]" />
            <span>Sister&apos;s Blessing & Brother&apos;s Sacred Pledge</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 font-bold leading-relaxed">
            &ldquo;Dear {sisterName}, as you tie this sacred Rakhi on my wrist, I pledge to forever protect your happiness, stand by your dreams, and love you endlessly.&rdquo; ❤️
          </p>
        </div>

        {/* View Summary Action Button */}
        <motion.button
          type="button"
          onClick={handleNextStep}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="w-full py-4 rounded-2xl text-white font-black tracking-widest text-sm sm:text-base shadow-lg shadow-rose-200/60 cursor-pointer flex items-center justify-center gap-2 border border-rose-200 select-none active:scale-95 transition-all"
        >
          <span>VIEW SUMMARY</span>
          <Heart className="w-4 h-4 text-white fill-white" />
        </motion.button>
      </motion.div>
    </div>
  );
}
