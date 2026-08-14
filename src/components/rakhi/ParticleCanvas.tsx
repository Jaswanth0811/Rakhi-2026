"use client";

import { useEffect, useRef } from "react";
import { sfx } from "@/lib/sfx";

interface ParticleCanvasProps {
  color?: string;
  particleCount?: number;
}

interface FloatingToy {
  x: number;
  y: number;
  vy: number;
  vx: number;
  emoji: string;
  size: number;
  rotation: number;
  vRot: number;
  alpha: number;
}

const TOYS = ["🧸", "🦋", "🌸", "✨", "🎁", "❤️", "🎈", "🌺", "⭐"];

export default function ParticleCanvas({
  color = "#E07A5F",
  particleCount = 50,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toysRef = useRef<FloatingToy[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create glowing stardust fireflies
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1.2,
      alpha: Math.random() * 0.7 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    // Create floating interactive toys/emojis
    toysRef.current = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 300,
      vy: -(Math.random() * 0.6 + 0.3),
      vx: (Math.random() - 0.5) * 0.3,
      emoji: TOYS[Math.floor(Math.random() * TOYS.length)],
      size: Math.floor(Math.random() * 14 + 20), // 20px - 34px
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.5 + 0.4,
    }));

    // Pointer stardust trail
    const trail: { x: number; y: number; alpha: number; size: number }[] = [];

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      for (let i = 0; i < 2; i++) {
        trail.push({
          x: clientX + (Math.random() - 0.5) * 15,
          y: clientY + (Math.random() - 0.5) * 15,
          alpha: 0.9,
          size: Math.random() * 3.5 + 1.5,
        });
      }
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      // Check if user clicked near a floating toy
      toysRef.current.forEach((toy, idx) => {
        const dx = toy.x - clientX;
        const dy = toy.y - clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 40) {
          sfx.playToyPop();
          // Reset toy to bottom with new emoji
          toysRef.current[idx] = {
            x: Math.random() * canvas.width,
            y: canvas.height + 50,
            vy: -(Math.random() * 0.6 + 0.3),
            vx: (Math.random() - 0.5) * 0.3,
            emoji: TOYS[Math.floor(Math.random() * TOYS.length)],
            size: Math.floor(Math.random() * 14 + 20),
            rotation: 0,
            vRot: (Math.random() - 0.5) * 0.8,
            alpha: Math.random() * 0.5 + 0.4,
          };

          // Burst trail sparkles
          for (let i = 0; i < 15; i++) {
            trail.push({
              x: clientX + (Math.random() - 0.5) * 40,
              y: clientY + (Math.random() - 0.5) * 40,
              alpha: 1.0,
              size: Math.random() * 5 + 2,
            });
          }
        }
      });
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchstart", handlePointerMove);
    window.addEventListener("click", handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw glowing stardust fireflies
      particles.forEach((p) => {
        p.angle += 0.02;
        p.x += p.vx + Math.sin(p.angle) * 0.2;
        p.y += p.vy + Math.cos(p.angle) * 0.2;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.012;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha));
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 2. Draw floating interactive toys/emojis
      toysRef.current.forEach((toy) => {
        toy.y += toy.vy;
        toy.x += toy.vx + Math.sin(toy.y * 0.01) * 0.25;
        toy.rotation += toy.vRot;

        if (toy.y < -50) {
          toy.y = canvas.height + 50;
          toy.x = Math.random() * canvas.width;
          toy.emoji = TOYS[Math.floor(Math.random() * TOYS.length)];
        }

        ctx.save();
        ctx.translate(toy.x, toy.y);
        ctx.rotate((toy.rotation * Math.PI) / 180);
        ctx.font = `${toy.size}px serif`;
        ctx.globalAlpha = toy.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#F4ACB7";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(toy.emoji, 0, 0);
        ctx.restore();
      });

      // 3. Draw pointer trail stardust
      for (let i = trail.length - 1; i >= 0; i--) {
        const t = trail[i];
        t.alpha -= 0.025;
        t.y -= 0.5;

        if (t.alpha <= 0) {
          trail.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        ctx.fillStyle = "#E07A5F";
        ctx.globalAlpha = t.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#F4ACB7";
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchstart", handlePointerMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0 opacity-90"
      style={{ pointerEvents: "auto" }}
    />
  );
}
