"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { cn } from "@/lib/utils";

export interface StickyScrollItem {
  title: string;
  description: string;
  /** Rendered in the pinned panel while this item is active */
  content?: React.ReactNode;
}

interface StickyScrollProps {
  items: StickyScrollItem[];
  className?: string;
}

/**
 * Long-form copy that scrolls past a pinned panel; the panel swaps as each
 * section takes over. The classic "how it works" section.
 */
export function StickyScroll({ items, className }: StickyScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!items.length) return;
    // Split the scrollable range into one band per item.
    const next = Math.min(
      items.length - 1,
      Math.floor(progress * items.length)
    );
    setActive(next);
  });

  if (!items.length) return null;

  return (
    <div
      ref={ref}
      data-slot="sticky-scroll"
      className={cn("relative flex gap-12", className)}
    >
      <div className="flex-1 py-[30vh]">
        {items.map((item, i) => (
          <div key={item.title} className="flex min-h-[60vh] flex-col justify-center">
            <motion.h3
              animate={{ opacity: active === i ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-semibold"
            >
              {item.title}
            </motion.h3>
            <motion.p
              animate={{ opacity: active === i ? 1 : 0.35 }}
              transition={{ duration: 0.3 }}
              className="mt-3 max-w-md text-muted-foreground"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>

      <div className="sticky top-[20vh] hidden h-[60vh] flex-1 lg:block">
        <div className="relative size-full overflow-hidden rounded-2xl border bg-gradient-to-br from-brand-from/10 to-brand-to/10">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={false}
              animate={{
                opacity: active === i ? 1 : 0,
                scale: active === i ? 1 : 0.97,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              aria-hidden={active !== i}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              {item.content ?? (
                <span className="text-xl font-medium">{item.title}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
