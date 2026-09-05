"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface MorphingTextProps {
  texts: string[];
  /** Seconds each phrase is held at full clarity */
  hold?: number;
  /** Seconds spent blurring between phrases */
  morph?: number;
  className?: string;
}

/**
 * Blurs one phrase out while the next resolves in, so the two appear to melt
 * through each other. Pure CSS filters — no runtime dependency.
 */
export function MorphingText({
  texts,
  hold = 2,
  morph = 0.8,
  className,
}: MorphingTextProps) {
  const [index, setIndex] = useState(0);
  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    if (texts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cycle = window.setInterval(
      () => {
        setBlurred(true);
        window.setTimeout(() => {
          setIndex((i) => (i + 1) % texts.length);
          setBlurred(false);
        }, morph * 500);
      },
      (hold + morph) * 1000
    );
    return () => window.clearInterval(cycle);
  }, [texts.length, hold, morph]);

  return (
    <span
      data-slot="morphing-text"
      style={{ transitionDuration: `${morph * 500}ms` }}
      className={cn(
        "inline-block transition-all ease-in-out will-change-[filter,opacity] motion-reduce:transition-none motion-reduce:blur-none motion-reduce:opacity-100",
        blurred ? "opacity-0 blur-md" : "opacity-100 blur-0",
        className
      )}
    >
      {texts[index]}
    </span>
  );
}
