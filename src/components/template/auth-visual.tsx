"use client";

import { TerminalIcon } from "lucide-react";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BorderBeam } from "@/components/velora/border-beam";
import { GridPattern } from "@/components/velora/grid-pattern";

/**
 * Engineering showcase panel for auth screens styled to match
 * the exact colors, aurora backdrop, and tokens of the landing page.
 */
export function AuthVisual() {
  return (
    <div className="relative hidden overflow-hidden lg:flex flex-col justify-center items-center p-12 bg-background border-l border-border/50">
      {/* Landing page signature aurora & grid */}
      <AuroraBackground intensity="medium" />
      <GridPattern
        width={48}
        height={48}
        className="fill-transparent stroke-border/40 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_90%)]"
      />

      <div className="relative w-full max-w-lg space-y-4 z-10">
        {/* Code Window matching landing page card styling */}
        <div className="relative rounded-2xl border border-border/70 bg-card/75 shadow-2xl backdrop-blur-xl overflow-hidden">
          <BorderBeam size={90} duration={8} />

          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="text-muted-foreground font-mono text-[11px] ml-2 font-medium">
                stego-engine.ts
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-mono font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              pipeline-ready
            </div>
          </div>

          {/* Code Content */}
          <div className="p-4 font-mono text-[11px] leading-relaxed text-card-foreground/90 overflow-x-auto selection:bg-primary/20">
            <div className="text-muted-foreground/70">// 1. Analisis selisih visual antar-frame</div>
            <div>
              <span className="text-primary font-medium">const</span> delta ={" "}
              <span className="text-blue-500">await</span>{" "}
              <span className="text-amber-500 dark:text-amber-400">interFrameDiff</span>(frameA, frameB);
            </div>
            <br />
            <div className="text-muted-foreground/70">// 2. Seleksi frame dinamis berbasis threshold</div>
            <div>
              <span className="text-primary font-medium">if</span> (delta.variance &gt;={" "}
              <span className="text-amber-600 dark:text-amber-400 font-semibold">THRESHOLD</span>) &#123;
            </div>
            <div className="pl-4">
              <span className="text-primary font-medium">await</span>{" "}
              <span className="text-amber-500 dark:text-amber-400">embedLSB</span>(&#123;
            </div>
            <div className="pl-8 text-muted-foreground">
              targetFrame: frameB,
            </div>
            <div className="pl-8 text-muted-foreground">
              payload: secretMessage,
            </div>
            <div className="pl-8 text-muted-foreground">
              bitDepth: <span className="text-cyan-500 font-medium">1</span>,{" "}
              <span className="text-muted-foreground/60">// Least Significant Bit</span>
            </div>
            <div className="pl-4">&#125;);</div>
            <div>&#125;</div>
          </div>

          {/* Terminal Output Tray */}
          <div className="border-t border-border/50 bg-background/60 p-3.5 font-mono text-[10px] space-y-1 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TerminalIcon className="size-3 text-primary" />
              <span>stego-cli telemetry --verify</span>
            </div>
            <div className="text-emerald-500/95 pl-4.5 font-medium">
              ✓ 1,420 frames extracted &bull; 248 dynamic frames selected
            </div>
            <div className="text-muted-foreground pl-4.5">
              ✓ PSNR: <span className="text-foreground font-semibold">54.82 dB</span> &bull; SSIM: <span className="text-foreground font-semibold">0.9984</span> &bull; BER: <span className="text-emerald-500 font-semibold">0.00%</span>
            </div>
          </div>
        </div>

        {/* Minimal Footer Info */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono px-1">
          <span>Target: 2D Animation Video</span>
          <span className="text-emerald-500 font-medium">Zero Visual Distortion</span>
        </div>
      </div>
    </div>
  );
}
