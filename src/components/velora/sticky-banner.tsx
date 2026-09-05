"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface StickyBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hide the dismiss button for banners that must stay put */
  dismissible?: boolean;
  /** Called after the banner is dismissed */
  onDismiss?: () => void;
  children: React.ReactNode;
}

/**
 * Announcement bar that pins to the top of the page and can be dismissed.
 * Sits above a sticky header when both are present.
 */
export function StickyBanner({
  dismissible = true,
  onDismiss,
  children,
  className,
  ...props
}: StickyBannerProps) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      {...props}
      data-slot="sticky-banner"
      className={cn(
        "sticky top-0 z-60 flex items-center justify-center gap-3 bg-gradient-to-r from-brand-from via-brand-via to-brand-to px-4 py-2.5 text-center text-sm text-brand-foreground",
        className
      )}
    >
      <div className="flex-1">{children}</div>
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            setOpen(false);
            onDismiss?.();
          }}
          className="-mr-1 shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}
