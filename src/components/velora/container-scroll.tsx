"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

interface ContainerScrollProps {
  /** Headline area above the panel */
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Screenshot panel that starts tilted back in 3D and rotates flat as it
 * scrolls into view — the standard "here is the product" hero moment.
 */
export function ContainerScroll({
  header,
  children,
  className,
}: ContainerScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.45], [26, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.92, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.45], [40, 0]);

  return (
    <div
      ref={ref}
      data-slot="container-scroll"
      className={cn("flex flex-col items-center", className)}
    >
      {header && (
        <motion.div
          style={reducedMotion ? undefined : { y: translateY }}
          className="mb-10 text-center"
        >
          {header}
        </motion.div>
      )}
      <motion.div
        style={
          reducedMotion
            ? undefined
            : { rotateX, scale, transformPerspective: 1200 }
        }
        className="w-full origin-top rounded-2xl border bg-card p-2 shadow-2xl shadow-brand/10 will-change-transform"
      >
        <div className="overflow-hidden rounded-xl border bg-muted">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
