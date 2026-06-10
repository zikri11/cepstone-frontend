"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  /** Base color, any CSS color */
  color?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  twinkle: number;
}

/**
 * Drifting, twinkling particle field on a canvas.
 * Renders a single static frame when reduced motion is preferred.
 */
export function Particles({
  className,
  quantity = 60,
  color = "255, 255, 255",
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: quantity }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        twinkle: Math.random() * 0.02 + 0.005,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
        ctx.fill();
      }
    };

    const tick = () => {
      for (const p of particles) {
        p.x = (p.x + p.vx + width) % width;
        p.y = (p.y + p.vy + height) % height;
        p.alpha += p.twinkle;
        if (p.alpha > 0.6 || p.alpha < 0.1) p.twinkle *= -1;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    resize();
    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [quantity, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-slot="particles"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
