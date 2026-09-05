"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  /** Zero-based index of the step in progress */
  current: number;
  /** Make completed steps clickable */
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * Horizontal progress indicator for multi-step forms and checkouts.
 * The connecting bar fills as steps complete.
 */
export function Stepper({
  steps,
  current,
  onStepClick,
  className,
}: StepperProps) {
  const reducedMotion = useReducedMotion();
  const progress = steps.length > 1 ? current / (steps.length - 1) : 0;

  return (
    <ol
      data-slot="stepper"
      className={cn("relative flex w-full justify-between", className)}
    >
      {/* Track sits behind the markers, inset by half a marker at each end. */}
      <div
        aria-hidden
        className="absolute top-4 right-4 left-4 -z-10 h-0.5 bg-border"
      >
        <motion.div
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: reducedMotion ? 0 : 0.4, ease: "easeOut" }}
          className="h-full origin-left bg-gradient-to-r from-brand-from to-brand-to"
        />
      </div>

      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const interactive = Boolean(onStepClick) && done;

        return (
          <li key={step} className="flex flex-col items-center gap-2">
            <button
              type="button"
              disabled={!interactive}
              onClick={() => onStepClick?.(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "grid size-8 place-items-center rounded-full border-2 bg-background text-xs font-medium transition-colors",
                done && "border-brand bg-brand text-brand-foreground",
                active && "border-brand text-brand",
                !done && !active && "border-border text-muted-foreground",
                interactive && "cursor-pointer"
              )}
            >
              {done ? (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M2.5 7.5l3 3 6-6" />
                </svg>
              ) : (
                i + 1
              )}
            </button>
            <span
              className={cn(
                "text-xs whitespace-nowrap",
                active ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
