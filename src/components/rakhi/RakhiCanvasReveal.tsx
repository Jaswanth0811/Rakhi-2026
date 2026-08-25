"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface RakhiCanvasRevealProps {
  sisterName: string;
  onNext: () => void;
}

interface BalloonItem {
  id: number;
  x: number; // percentage (5% to 90%)
  size: number; // px diameter (45 to 70)
  color: string;
  highlightColor: string;
  delay: number; // animation delay
  duration: number; // float duration
  wobbleDuration: number;
  popped: boolean;
}

interface FloatingHeartItem {
  id: number;
  x: number;
  size: number;
  symbol: string;
  duration: number;
  delay: number;
}

const BALLOON_COLORS = [
  { color: "#FF4B72", highlight: "#FFA3B8" }, // Vibrant Pink
  { color: "#E07A5F", highlight: "#F8C5B8" }, // Terracotta Rose
  { color: "#FF85A1", highlight: "#FFCCD7" }, // Soft Blush
  { color: "#FB8500", highlight: "#FFD199" }, // Warm Amber
  { color: "#FFB703", highlight: "#FFE599" }, // Golden Honey
  { color: "#E63946", highlight: "#FFA8AF" }, // Ruby Red
  { color: "#9D4EDD", highlight: "#D8B4F8" }, // Violet Sparkle
  { color: "#06D6A0", highlight: "#A3F7E2" }, // Emerald Mint
];

const HEART_SYMBOLS = ["💖", "❤️", "💕", "💗", "💓", "💞", "💝", "✨"];

export default function RakhiCanvasReveal({ sisterName, onNext }: RakhiCanvasRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [hearts, setHearts] = useState<FloatingHeartItem[]>([]);
  const [popParticles, setPopParticles] = useState<
    { id: number; x: number; y: number; color: string; symbol?: string }[]
  >([]);

  // Initialize floating balloons and hearts
  useEffect(() => {
    const initialBalloons: BalloonItem[] = Array.from({ length: 12 }, (_, i) => {
      const colorScheme = BALLOON_COLORS[i % BALLOON_COLORS.length];
      return {
        id: i + 1,
        x: 4 + (i * 8.2) + (Math.random() * 4 - 2),
        size: 52 + Math.floor(Math.random() * 22),
        color: colorScheme.color,
        highlightColor: colorScheme.highlight,
        delay: Math.random() * 4,
        duration: 9 + Math.random() * 6,
        wobbleDuration: 2.5 + Math.random() * 1.5,
        popped: false,
      };
    });
    setBalloons(initialBalloons);

    const initialHearts: FloatingHeartItem[] = Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      x: 3 + Math.random() * 94,
      size: 20 + Math.floor(Math.random() * 20),
      symbol: HEART_SYMBOLS[i % HEART_SYMBOLS.length],
      duration: 6 + Math.random() * 5,
      delay: Math.random() * 5,
    }));
    setHearts(initialHearts);
  }, []);

  // Multi-stage confetti paper cannons and streamers explosion
  const triggerGrandCelebration = useCallback(() => {
    sfx.playFanfare();

    // Center grand explosion (multi-color paper rectangles & stars)
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.55 },
      colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FBBF24", "#FF4B72", "#FFFFFF", "#FFD700"],
      ticks: 200,
      gravity: 0.8,
      scalar: 1.2,
      shapes: ["square", "circle"],
    });

    // Left cannon blasting papers across
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.8 },
        colors: ["#FF4B72", "#FFB703", "#9D4EDD", "#FFFFFF", "#F4ACB7"],
        ticks: 200,
        gravity: 0.9,
      });
    }, 150);

    // Right cannon blasting papers across
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.8 },
        colors: ["#E07A5F", "#D97706", "#06D6A0", "#FFFFFF", "#FB8500"],
        ticks: 200,
        gravity: 0.9,
      });
    }, 300);

    // Falling golden and rose streamers from the sky
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 160,
        origin: { y: 0.1 },
        colors: ["#FFD700", "#FF4B72", "#F4ACB7", "#FFFFFF"],
        ticks: 250,
        gravity: 0.6,
        scalar: 1.4,
      });
    }, 450);
  }, []);

  // Handle balloon pop
  const handleBalloonPop = (id: number, x: number, y: number, color: string) => {
    sfx.playPop();

    // Create burst particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() * 40 - 20),
      y: y + (Math.random() * 40 - 20),
      color,
      symbol: i % 2 === 0 ? "💖" : "✨",
    }));

    setPopParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setPopParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 900);

    // Mini confetti burst at balloon position
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: [color, "#FFFFFF", "#FFD700", "#FF4B72"],
      gravity: 0.9,
      scalar: 1.1,
    });

    // Mark balloon as popped and respawn after 3 seconds
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                popped: false,
                x: 4 + Math.random() * 90,
                delay: 0,
              }
            : b
        )
      );
    }, 2800);
  };

  const handleNextStep = () => {
    sfx.playChime();
    onNext();
  };

  useEffect(() => {
    triggerGrandCelebration();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let angle = 0;

    const resize = () => {
      canvas.width = Math.min(window.innerWidth * 0.75, 300);
      canvas.height = Math.min(window.innerWidth * 0.75, 300);
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
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#F4ACB7";
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
        ctx.arc(px, py, 13, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#E07A5F" : "#D97706";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#F4ACB7";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // Outer Ring
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.75, 0, Math.PI * 2);
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#F59E0B";
      ctx.stroke();

      // Inner Core Center
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#991B1B";
      ctx.shadowBlur = 22;
      ctx.shadowColor = "#E07A5F";
      ctx.fill();

      // Star emblem in center
      ctx.font = `${baseRadius * 0.4}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("✨", 0, 0);

      ctx.restore();

      angle += 0.008;
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
      <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-pink-200/50 blur-[130px] pointer-events-none" />

      {/* FLOATING HEART SYMBOLS LAYER (Background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ y: "105vh", opacity: 0, scale: 0.6 }}
            animate={{
              y: ["105vh", "-10vh"],
              opacity: [0, 0.85, 0.95, 0],
              scale: [0.6, 1.2, 1, 0.8],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${h.x}%`,
              fontSize: `${h.size}px`,
            }}
            className="absolute drop-shadow-md select-none will-change-transform"
          >
            {h.symbol}
          </motion.div>
        ))}
      </div>

      {/* FLOATING & POPPABLE BALLOONS LAYER (Pass clicks through to card) */}
      <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
        {balloons.map((b) =>
          !b.popped ? (
            <motion.div
              key={b.id}
              initial={{ y: "110vh", opacity: 0 }}
              animate={{
                y: ["110vh", "-15vh"],
                opacity: [0, 0.95, 0.95, 0],
                x: [0, 18, -18, 0],
              }}
              transition={{
                y: {
                  duration: b.duration,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: "linear",
                },
                opacity: {
                  duration: b.duration,
                  delay: b.delay,
                  repeat: Infinity,
                  ease: "linear",
                },
                x: {
                  duration: b.wobbleDuration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
              style={{
                left: `${b.x}%`,
                width: `${b.size}px`,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleBalloonPop(b.id, rect.left + rect.width / 2, rect.top + rect.height / 2, b.color);
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              className="absolute pointer-events-auto cursor-pointer flex flex-col items-center select-none group touch-manipulation will-change-transform"
              title="Tap to Pop Balloon! 🎈"
            >
              {/* Balloon 3D Oval Body */}
              <div
                style={{
                  width: `${b.size}px`,
                  height: `${b.size * 1.25}px`,
                  borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                  background: `radial-gradient(circle at 35% 30%, ${b.highlightColor} 0%, ${b.color} 70%, #550015 100%)`,
                  boxShadow: `0 8px 20px ${b.color}40, inset 0 -4px 8px rgba(0,0,0,0.15)`,
                }}
                className="relative transition-transform duration-150 group-hover:scale-105"
              >
                {/* Glossy Light Reflection */}
                <div
                  style={{
                    width: `${b.size * 0.22}px`,
                    height: `${b.size * 0.4}px`,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.65)",
                    transform: "rotate(-25deg)",
                  }}
                  className="absolute top-2 left-2 blur-[0.5px]"
                />
              </div>

              {/* Balloon Knot */}
              <div
                style={{
                  width: `${b.size * 0.18}px`,
                  height: `${b.size * 0.12}px`,
                  backgroundColor: b.color,
                  clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                }}
                className="-mt-0.5"
              />

              {/* Balloon String */}
              <div
                style={{
                  height: `${b.size * 0.75}px`,
                }}
                className="w-[1.5px] bg-gray-400/80 -mt-0.5 origin-top animate-pulse"
              />
            </motion.div>
          ) : null
        )}

        {/* Balloon Pop Burst Particles */}
        <AnimatePresence>
          {popParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 1.5, opacity: 1, x: p.x, y: p.y }}
              animate={{
                scale: [1.5, 0.4],
                opacity: [1, 0],
                y: p.y - 45,
                x: p.x + (Math.random() * 50 - 25),
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="fixed pointer-events-none text-2xl z-50 drop-shadow-md"
            >
              {p.symbol || "✨"}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MAIN RAKHI CEREMONY CARD (Highest z-index so all buttons & interactions work 100%) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-30 pointer-events-auto w-full max-w-md bg-white/95 border-2 border-rose-200/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_20px_50px_rgba(224,122,95,0.15)] text-center flex flex-col items-center will-change-transform"
      >
        {/* Festive Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-[#E07A5F] text-xs font-black tracking-widest uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Virtual Rakhi Ceremony</span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-xs">
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
          title="Tap Rakhi for Balloons, Hearts & Papers Confetti Explosion! 🎈💖🎊"
        >
          <canvas
            ref={canvasRef}
            className="w-[230px] h-[230px] sm:w-[270px] sm:h-[270px] rounded-full drop-shadow-[0_15px_35px_rgba(224,122,95,0.25)] group-hover:scale-105 transition-transform duration-300 active:scale-95"
          />
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest text-[#E07A5F] bg-white px-3 py-1 rounded-full border border-rose-200 whitespace-nowrap shadow-md flex items-center gap-1"
          >
            <span>TAP RAKHI & BALLOONS TO POP! 🎈💖🎊</span>
          </motion.span>
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
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="w-full py-4 rounded-2xl text-white font-black tracking-widest text-sm sm:text-base shadow-lg shadow-rose-200 cursor-pointer flex items-center justify-center gap-2 border border-rose-200 select-none active:scale-95"
        >
          <span>VIEW SUMMARY</span>
          <Heart className="w-4 h-4 text-white fill-white" />
        </motion.button>
      </motion.div>
    </div>
  );
}
