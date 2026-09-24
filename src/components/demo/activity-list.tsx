"use client";

import {
  CheckCircle2Icon,
  CpuIcon,
  FileTextIcon,
  LayersIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";

import { AnimatedList } from "@/components/velora/animated-list";
import { cn } from "@/lib/utils";

const notifications = [
  {
    icon: LayersIcon,
    tone: "bg-blue-500/15 text-blue-500",
    title: "Ekstraksi Frame Video",
    description: "1,420 frame berhasil diekstrak dari video animasi",
    time: "baru saja",
  },
  {
    icon: CpuIcon,
    tone: "bg-amber-500/15 text-amber-500",
    title: "Analisis Inter-Frame Difference",
    description: "248 frame dinamis teridentifikasi (Threshold > 15.0)",
    time: "2 dtk lalu",
  },
  {
    icon: ZapIcon,
    tone: "bg-emerald-500/15 text-emerald-500",
    title: "Penyisipan Bit LSB",
    description: "Pesan rahasia berhasil disisipkan ke bit LSB",
    time: "4 dtk lalu",
  },
  {
    icon: ShieldCheckIcon,
    tone: "bg-cyan-500/15 text-cyan-500",
    title: "Uji Kualitas Visual (PSNR)",
    description: "Nilai PSNR 54.8 dB — Perubahan tidak kasat mata",
    time: "7 dtk lalu",
  },
  {
    icon: CheckCircle2Icon,
    tone: "bg-violet-500/15 text-violet-500",
    title: "Rekonstruksi Video Stego",
    description: "Video stego siap diunduh (durasi & audio identik)",
    time: "10 dtk lalu",
  },
  {
    icon: FileTextIcon,
    tone: "bg-emerald-500/15 text-emerald-500",
    title: "Verifikasi Ekstraksi Pesan",
    description: "Pesan teks asli berhasil diungkap 100% utuh",
    time: "15 dtk lalu",
  },
];

/**
 * Looping notification feed built on <AnimatedList />.
 */
export function ActivityList({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-[26rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]",
        className
      )}
    >
      <AnimatedList delay={1800}>
        {notifications.map((n) => (
          <div
            key={n.title}
            className="flex items-center gap-4 rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur"
          >
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                n.tone
              )}
            >
              <n.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between gap-2 text-sm font-medium">
                {n.title}
                <span className="shrink-0 text-xs font-normal text-muted-foreground">
                  {n.time}
                </span>
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {n.description}
              </p>
            </div>
          </div>
        ))}
      </AnimatedList>
    </div>
  );
}
