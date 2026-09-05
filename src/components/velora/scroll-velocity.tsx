"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";

interface ScrollVelocityProps {
  children: React.ReactNode;
  /** Base speed in percent of content width per second */
  baseVelocity?: number;
  className?: string;
}

/**
 * A marquee whose speed and direction respond to how fast you are scrolling.
 * Holds a steady drift when the page is still.
 */
export function ScrollVelocity({
  children,
  baseVelocity = 4,
  className,
}: ScrollVelocityProps) {
  const baseX = useMotionValue(0);
  const direction = useRef(1);
  const reducedMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const velocityFactor = useTransform(scrollVelocity, [-1200, 1200], [-4, 4], {
    clamp: false,
  });

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    // Scrolling backwards flips the marquee's direction.
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * Math.abs(factor);
    // One copy is 25% of the four-copy track, so wrap there.
    baseX.set(((baseX.get() + moveBy) % 25) - 25);
  });

  const x = useTransform(baseX, (value) => `${value}%`);

  return (
    <div
      data-slot="scroll-velocity"
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
    >
      <motion.div style={{ x }} className="flex w-max gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} aria-hidden={i > 0 || undefined} className="shrink-0">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
