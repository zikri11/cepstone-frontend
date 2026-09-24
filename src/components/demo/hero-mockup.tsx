"use client";

import { motion } from "motion/react";
import {
  BarChart3Icon,
  CreditCardIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import { BorderBeam } from "@/components/velora/border-beam";
import { BrowserMockup } from "@/components/velora/browser-mockup";
import { NumberTicker } from "@/components/velora/number-ticker";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboardIcon, label: "Frame Analyzer", active: true },
  { icon: BarChart3Icon, label: "Inter-Frame Diff" },
  { icon: UsersIcon, label: "LSB Embedding" },
  { icon: CreditCardIcon, label: "Evaluasi PSNR" },
  { icon: SettingsIcon, label: "Threshold Config" },
];

const stats = [
  { label: "Total Frame Dianalisis", value: 1420, prefix: "", change: "100% Valid" },
  { label: "Frame Terpilih (Diff > Th)", value: 248, prefix: "", change: "Dinamis" },
  { label: "Rata-rata PSNR", value: 54.8, prefix: "", change: "Imperceptible", decimals: 1, suffix: " dB" },
];

const bars = [38, 62, 48, 74, 56, 88, 66, 92, 60, 78, 84, 98];

/**
 * Steganography analysis dashboard mockup inside a browser frame.
 */
export function HeroMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-5xl", className)}>
      {/* Glow */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[2rem] bg-gradient-to-r from-brand-from via-brand-via to-brand-to opacity-20 blur-3xl"
      />

      <BrowserMockup url="stegoanim2d.local/analyzer" className="relative">
        <BorderBeam size={96} duration={10} />

        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden w-44 flex-col gap-1 border-r border-border/60 p-3 md:flex">
            {navItems.map((item) => (
              <span
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
                  item.active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </span>
            ))}
          </aside>

          {/* Main */}
          <div className="flex-1 p-4 lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">Visualisasi Inter-Frame Difference</span>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Ambang Batas (Threshold): 15.0
              </span>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/60 bg-background/40 p-3 lg:p-4"
                >
                  <p className="text-[11px] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-base font-semibold lg:text-xl">
                    <NumberTicker
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix ?? ""}
                      decimalPlaces={stat.decimals ?? 0}
                    />
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-500">
                    <TrendingUpIcon className="size-3" />
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="mt-3 rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium">Perbedaan Visual Piksel Antar-Frame (Inter-Frame Delta)</span>
                <span className="text-[11px] text-muted-foreground">Video Animasi 2D</span>
              </div>
              <div className="flex h-32 items-end gap-2 lg:h-40">
                {bars.map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + i * 0.05,
                      duration: 0.5,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    className="flex-1 origin-bottom rounded-t-sm bg-gradient-to-t from-brand-from to-brand-via"
                    style={{ height: `${height}%`, opacity: 0.5 + height / 200 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </BrowserMockup>
    </div>
  );
}
