"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface FloatingNavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Pixels scrolled before the bar is allowed to hide */
  revealAfter?: number;
  children: React.ReactNode;
}

/**
 * Header that slides away as you scroll down and returns the moment you
 * scroll back up. Renders visible on the server, so there is no flash.
 */
export function FloatingNavbar({
  revealAfter = 120,
  children,
  className,
  ...props
}: FloatingNavbarProps) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY.current;
        // Ignore sub-pixel jitter and rubber-band scroll past the top.
        if (Math.abs(delta) < 4) return;
        setHidden(delta > 0 && y > revealAfter);
        lastY.current = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [revealAfter]);

  return (
    <header
      {...props}
      data-slot="floating-navbar"
      className={cn(
        "fixed inset-x-0 top-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-3xl items-center justify-between gap-4 rounded-full border bg-background/80 px-5 py-2.5 shadow-lg shadow-foreground/5 backdrop-blur-md transition-transform duration-300 ease-out motion-reduce:transition-none",
        hidden ? "-translate-y-[calc(100%+1.5rem)]" : "translate-y-0",
        className
      )}
    >
      {children}
    </header>
  );
}
