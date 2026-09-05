"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  /** Seconds each word is held */
  interval?: number;
  className?: string;
}

/**
 * Swaps a single word on a vertical roll. Lighter than Flip Words — no blur,
 * no spring — for headlines that need the effect to stay quiet.
 */
export function WordRotate({
  words,
  interval = 2.5,
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (words.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval * 1000
    );
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      data-slot="word-rotate"
      className="inline-grid overflow-hidden align-bottom"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={cn("col-start-1 row-start-1", className)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
