"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Edge = "top" | "right" | "bottom" | "left";

const ENTER: Record<Edge, string> = {
  top: "-translate-y-full",
  right: "translate-x-full",
  bottom: "translate-y-full",
  left: "-translate-x-full",
};

interface DirectionAwareHoverProps {
  children: React.ReactNode;
  /** Slides in from whichever edge the cursor crossed */
  overlay: React.ReactNode;
  className?: string;
}

/**
 * Overlay that enters from the edge the cursor actually crossed and leaves the
 * same way. Zero dependencies — the maths is one arctangent.
 */
export function DirectionAwareHover({
  children,
  overlay,
  className,
}: DirectionAwareHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<Edge>("bottom");
  const [hovered, setHovered] = useState(false);

  const edgeFrom = (event: React.MouseEvent<HTMLDivElement>): Edge => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return "bottom";
    // Angle from the centre, corrected for aspect ratio, mapped to quadrants.
    const x = (event.clientX - rect.left - rect.width / 2) * (rect.height / rect.width);
    const y = event.clientY - rect.top - rect.height / 2;
    const quadrant = Math.round(Math.atan2(y, x) / (Math.PI / 2) + 4) % 4;
    return (["right", "bottom", "left", "top"] as const)[quadrant];
  };

  return (
    <div
      ref={ref}
      data-slot="direction-aware-hover"
      onMouseEnter={(event) => {
        setEdge(edgeFrom(event));
        setHovered(true);
      }}
      onMouseLeave={(event) => {
        setEdge(edgeFrom(event));
        setHovered(false);
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card",
        className
      )}
    >
      {children}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-from to-brand-to text-brand-foreground transition-transform duration-300 ease-out motion-reduce:transition-none",
          hovered ? "translate-x-0 translate-y-0" : ENTER[edge]
        )}
      >
        {overlay}
      </div>
    </div>
  );
}
