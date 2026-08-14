"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart, ShieldCheck, ChevronDown } from "lucide-react";
import { sfx } from "@/lib/sfx";

interface RakhiCanvasRevealProps {
  sisterName: string;
  onNext: () => void;
}

export default function RakhiCanvasReveal({ sisterName, onNext }: RakhiCanvasRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerConfettiExplosion = () => {
    sfx.playFanfare();
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#E07A5F", "#F4ACB7", "#D97706", "#FBBF24", "#FFFFFF", "#FFD700"],
    });
  };

  const handleNextStep = () => {
    sfx.playChime();
    onNext();
  };

  useEffect(() => {
    triggerConfettiExplosion();

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
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFF5F7] to-[#F5EFE6] text-gray-900">
      {/* Background glow */}
      <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-pink-200/50 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 w-full max-w-md bg-white/95 border-2 border-rose-200/80 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-[0_20px_50px_rgba(224,122,95,0.15)] text-center flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-[#E07A5F] text-xs font-extrabold tracking-widest uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
          <span>Virtual Rakhi Ceremony</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 drop-shadow-sm">
          Virtual Rakhi Tied By <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E07A5F] via-[#F4ACB7] to-[#D97706]">
            {sisterName} ❤️
          </span>
        </h2>
        <p className="text-xs text-gray-700 font-bold">
          Your sacred thread of love tied on your brother&apos;s wrist.
        </p>

        {/* 3D Rotating Canvas Rakhi Emblem */}
        <div
          onClick={() => {
            sfx.playToyPop();
            triggerConfettiExplosion();
          }}
          className="relative my-1 cursor-pointer group"
          title="Tap Rakhi for Sparkles & Confetti!"
        >
          <canvas
            ref={canvasRef}
            className="w-[230px] h-[230px] sm:w-[270px] sm:h-[270px] rounded-full drop-shadow-[0_15px_35px_rgba(224,122,95,0.25)] group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase tracking-widest text-[#E07A5F] bg-white px-2.5 py-0.5 rounded-full border border-rose-200 whitespace-nowrap shadow-md">
            TAP RAKHI FOR CONFETTI 🎊
          </span>
        </div>

        {/* Promise Badge */}
        <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1.5 w-full text-center shadow-inner">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#E07A5F] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#E07A5F]" />
            <span>Sister&apos;s Blessing & Brother&apos;s Sacred Pledge</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-800 font-bold leading-relaxed">
            &ldquo;Dear {sisterName}, as you tie this sacred Rakhi on my wrist, I pledge to forever protect your happiness, stand by your dreams, and love you endlessly.&rdquo; ❤️
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleNextStep}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: "linear-gradient(135deg, #E07A5F 0%, #F4ACB7 50%, #D97706 100%)",
          }}
          className="w-full py-4 rounded-2xl text-white font-black tracking-widest text-sm sm:text-base shadow-lg shadow-rose-200 cursor-pointer flex items-center justify-center gap-2 border border-rose-200"
        >
          <span>VIEW SUMMARY</span>
          <Heart className="w-4 h-4 text-white fill-white" />
        </motion.button>
      </motion.div>
    </div>
  );
}
