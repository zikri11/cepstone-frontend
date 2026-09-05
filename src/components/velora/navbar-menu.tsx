"use client";

import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const MenuContext = createContext<{
  active: string | null;
  setActive: (value: string | null) => void;
}>({ active: null, setActive: () => {} });

/**
 * Hover-driven navigation menu whose panel morphs between items.
 * Wrap `MenuItem`s in `NavbarMenu`; the panel closes when the pointer leaves.
 */
export function NavbarMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <MenuContext.Provider value={{ active, setActive }}>
      <nav
        data-slot="navbar-menu"
        onMouseLeave={() => setActive(null)}
        className={cn(
          "relative flex items-center gap-1 rounded-full border bg-background/80 px-3 py-1.5 backdrop-blur-md",
          className
        )}
      >
        {children}
      </nav>
    </MenuContext.Provider>
  );
}

export function MenuItem({
  label,
  children,
  className,
}: {
  label: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { active, setActive } = useContext(MenuContext);
  const reducedMotion = useReducedMotion();
  const open = active === label;

  return (
    <div
      className="relative"
      onMouseEnter={() => setActive(label)}
      onFocus={() => setActive(label)}
    >
      <button
        type="button"
        aria-expanded={open}
        className={cn(
          "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
          open ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        {open && (
          <motion.span
            layoutId="navbar-menu-pill"
            className="absolute inset-0 -z-10 rounded-full bg-muted"
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 32 }
            }
          />
        )}
        {label}
      </button>

      <AnimatePresence>
        {open && children && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 mt-3 w-max -translate-x-1/2 rounded-2xl border bg-popover p-3 text-popover-foreground shadow-xl shadow-foreground/5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
