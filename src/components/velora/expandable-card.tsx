"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  /** Shown only once the card is expanded */
  children: React.ReactNode;
  /** Rendered in both the collapsed card and the expanded panel */
  media?: React.ReactNode;
  className?: string;
}

/**
 * Card that expands into a centred panel, with the title and media animating
 * between the two positions via a shared layout id.
 */
export function ExpandableCard({
  title,
  subtitle,
  children,
  media,
  className,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const spring = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 32 };

  return (
    <>
      <motion.button
        type="button"
        layoutId={`card-${id}`}
        onClick={() => setOpen(true)}
        transition={spring}
        aria-expanded={open}
        data-slot="expandable-card"
        className={cn(
          "flex w-full max-w-sm cursor-pointer flex-col gap-3 rounded-2xl border bg-card p-4 text-left transition-colors hover:bg-muted/50",
          className
        )}
      >
        {media && (
          <motion.div
            layoutId={`media-${id}`}
            transition={spring}
            className="overflow-hidden rounded-xl"
          >
            {media}
          </motion.div>
        )}
        <motion.h3 layoutId={`title-${id}`} transition={spring} className="font-medium">
          {title}
        </motion.h3>
        {subtitle && (
          <p className="-mt-2 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`card-${id}`}
              transition={spring}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="relative flex w-full max-w-lg flex-col gap-4 rounded-2xl border bg-card p-6 shadow-2xl"
            >
              {media && (
                <motion.div
                  layoutId={`media-${id}`}
                  transition={spring}
                  className="overflow-hidden rounded-xl"
                >
                  {media}
                </motion.div>
              )}
              <motion.h3
                layoutId={`title-${id}`}
                transition={spring}
                className="text-lg font-semibold"
              >
                {title}
              </motion.h3>
              <div className="text-sm text-muted-foreground">{children}</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="self-start rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
