"use client";

import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  EyeIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HardDriveIcon,
  LayersIcon,
  PlayCircleIcon,
  SlidersIcon,
  SparklesIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";

import { FrameMetric } from "@/types/stego";
import { mockFrameMetrics, overviewStats } from "@/lib/stego-mock-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function TelemetryTab() {
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(2); // Frame #3 by default (Dynamic)
  const [viewMode, setViewMode] = useState<"side_by_side" | "diff_heatmap">(
    "side_by_side"
  );

  const activeFrame = mockFrameMetrics[selectedFrameIndex];

  // Export handlers
  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            projectTitle: "Evaluasi Steganografi Video Animasi 2D",
            algorithm: "Inter-Frame Difference + LSB",
            overview: overviewStats,
            frameSequence: mockFrameMetrics,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "telemetri_steganografi_skripsi.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = "Frame,Timestamp,Delta_Motion,Region_Type,PSNR_dB,SSIM,MSE,Bits_Embedded\n";
    const rows = mockFrameMetrics
      .map(
        (f) =>
          `${f.frameNumber},"${f.timestamp}",${f.motionDelta},${
            f.isDynamicRegion ? "Dinamis" : "Statis"
          },${f.psnr},${f.ssim},${f.mse},${f.embeddedBits}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "evaluasi_citra_frame_skripsi.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Tab Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Analisis Komparasi Citra (Telemetry &amp; Frame Diff)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Inspeksi visual per-frame antara cover video asli dan stego-video untuk membuktikan aspek ketidaktampakan (<em>imperceptibility</em>).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-border/70 bg-background/50 hover:bg-muted/40 transition-colors cursor-pointer"
          >
            <FileSpreadsheetIcon className="size-3.5 text-emerald-500" />
            <span>Ekspor CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <DownloadIcon className="size-3.5" />
            <span>Ekspor JSON Riset</span>
          </button>
        </div>
      </div>

      {/* Visual Inspector Section */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-5 space-y-5">
        {/* Viewer Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              Inspektor Frame #{activeFrame.frameNumber} ({activeFrame.timestamp})
            </span>
            <Badge
              variant="outline"
              className={
                activeFrame.isDynamicRegion
                  ? "text-[10px] text-primary border-primary/30 bg-primary/5"
                  : "text-[10px] text-muted-foreground border-border/50"
              }
            >
              {activeFrame.isDynamicRegion ? "Frame Dinamis (Area Sisip)" : "Frame Statis (Held Frame)"}
            </Badge>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("side_by_side")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "side_by_side"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Side-by-Side (Asli vs Stego)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("diff_heatmap")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "diff_heatmap"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Peta Selisih Gerak (Heatmap &Delta;)
            </button>
          </div>
        </div>

        {/* Dual Canvas Display */}
        {viewMode === "side_by_side" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Original Frame */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">
                  Frame #{activeFrame.frameNumber} - Cover Asli (Original)
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">1920x1080 @ 24fps</span>
              </div>
              <div className="relative aspect-video rounded-xl border border-border/60 bg-neutral-900/90 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                {/* Visual mock 2D frame illustration */}
                <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent opacity-60" />
                <div className="relative z-10 space-y-2">
                  <div className="size-16 rounded-full border-2 border-dashed border-white/20 mx-auto flex items-center justify-center">
                    <div className="size-10 rounded-full bg-blue-500/20 border border-blue-400/40" />
                  </div>
                  <div className="text-[11px] font-mono text-white/70">
                    Karakter Animasi 2D (Pose Asli)
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/80">
                  Uncompressed Reference
                </div>
              </div>
            </div>

            {/* Right: Stego Frame */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle2Icon className="size-3.5" />
                  Frame #{activeFrame.frameNumber} - Stego (Disisipkan)
                </span>
                <span className="text-[11px] font-mono text-emerald-500">
                  PSNR: {activeFrame.psnr} dB
                </span>
              </div>
              <div className="relative aspect-video rounded-xl border border-emerald-500/30 bg-neutral-900/90 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent opacity-60" />
                <div className="relative z-10 space-y-2">
                  <div className="size-16 rounded-full border-2 border-dashed border-emerald-400/30 mx-auto flex items-center justify-center">
                    <div className="size-10 rounded-full bg-emerald-500/20 border border-emerald-400/50" />
                  </div>
                  <div className="text-[11px] font-mono text-white/70">
                    Piksel LSB Termodifikasi (Imperceptible)
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-xs text-[10px] font-mono text-emerald-300">
                  SSIM: {activeFrame.ssim} (Identik)
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Difference Heatmap View */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Peta Pergeseran Piksel Antar-Frame &Delta;(x,y,t)
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Nilai Ambang Batas: &Delta; = {activeFrame.motionDelta}
              </span>
            </div>
            <div className="relative h-64 w-full rounded-xl border border-border/60 bg-neutral-950 overflow-hidden flex flex-col items-center justify-center text-center p-6">
              {/* Heatmap visualization */}
              <div className="w-full max-w-md h-32 relative rounded-lg border border-white/10 bg-black/60 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-around opacity-40">
                  <div className="w-16 h-20 bg-blue-500/30 blur-md rounded-full" />
                  <div className="w-24 h-24 bg-amber-500/40 blur-lg rounded-full animate-pulse" />
                  <div className="w-12 h-16 bg-blue-500/30 blur-md rounded-full" />
                </div>
                <div className="relative z-10 space-y-1">
                  <span className="text-xs font-mono text-white font-medium block">
                    {activeFrame.isDynamicRegion
                      ? "\u25CF Area Gerak Terdeteksi (Motion Region Aktif)"
                      : "\u25CB Area Statis (Tidak Ada Penyisipan)"}
                  </span>
                  <p className="text-[11px] text-white/60">
                    {activeFrame.isDynamicRegion
                      ? `Menampung ${activeFrame.embeddedBits} bits payload pada LSB channel`
                      : "Dilewati untuk melindungi integritas kontur garis animasi"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-500" />
                  Area Statis (Background / Line)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500" />
                  Area Dinamis Gerak (&Delta; &gt; 12)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Frame Timeline Slider Navigation */}
        <div className="pt-2 border-t border-border/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedFrameIndex === 0}
                onClick={() => setSelectedFrameIndex((prev) => Math.max(0, prev - 1))}
                className="size-7 rounded-md border border-border/60 hover:bg-muted/40 disabled:opacity-30 flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <button
                type="button"
                disabled={selectedFrameIndex === mockFrameMetrics.length - 1}
                onClick={() =>
                  setSelectedFrameIndex((prev) =>
                    Math.min(mockFrameMetrics.length - 1, prev + 1)
                  )
                }
                className="size-7 rounded-md border border-border/60 hover:bg-muted/40 disabled:opacity-30 flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronRightIcon className="size-4" />
              </button>
              <span className="text-muted-foreground font-mono">
                Frame {selectedFrameIndex + 1} dari {mockFrameMetrics.length}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 text-[11px] font-mono">
              <div>
                <span className="text-muted-foreground block text-[10px]">PSNR</span>
                <span className="text-emerald-500 font-bold">{activeFrame.psnr} dB</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">SSIM</span>
                <span className="text-sky-500 font-bold">{activeFrame.ssim}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">MSE</span>
                <span className="text-foreground">{activeFrame.mse}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">Delta Gerak</span>
                <span className="text-purple-400">{activeFrame.motionDelta}</span>
              </div>
            </div>
          </div>

          {/* Quick Clickable Frame Dots */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
            {mockFrameMetrics.map((f, i) => (
              <button
                key={f.frameNumber}
                type="button"
                onClick={() => setSelectedFrameIndex(i)}
                className={`h-5 flex-1 min-w-[20px] rounded text-[10px] font-mono font-medium transition-all cursor-pointer flex items-center justify-center ${
                  i === selectedFrameIndex
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : f.isDynamicRegion
                    ? "bg-primary/15 text-primary hover:bg-primary/25"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {f.frameNumber}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Frame-by-Frame Data Table */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Tabel Telemetri Lengkap Rangkaian Frame Animasi (20 Frame Sequence)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Data evaluasi citra frame-by-frame untuk pengujian objektif skripsi.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Standar: PSNR &gt; 40 dB • SSIM &gt; 0.98
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border/40">
              <tr>
                <th className="py-2.5 px-3">Frame</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Delta Selisih (&Delta;)</th>
                <th className="py-2.5 px-3">Kategori Region</th>
                <th className="py-2.5 px-3">PSNR (dB)</th>
                <th className="py-2.5 px-3">SSIM</th>
                <th className="py-2.5 px-3">MSE</th>
                <th className="py-2.5 px-3 text-right">Bit Disisipkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {mockFrameMetrics.map((f, i) => {
                const isSelected = i === selectedFrameIndex;
                return (
                  <tr
                    key={f.frameNumber}
                    onClick={() => setSelectedFrameIndex(i)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 font-medium"
                        : "hover:bg-muted/20"
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono">
                      #{f.frameNumber}
                      {isSelected && (
                        <span className="ms-1.5 text-[10px] text-primary font-bold">
                          [Aktif]
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {f.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                      {f.motionDelta}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant="outline"
                        className={
                          f.isDynamicRegion
                            ? "text-[10px] text-primary border-primary/30 bg-primary/5 py-0"
                            : "text-[10px] text-muted-foreground border-border/50 py-0"
                        }
                      >
                        {f.isDynamicRegion ? "Dinamis" : "Statis"}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-emerald-500">
                      {f.psnr} dB
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-sky-500">
                      {f.ssim}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted-foreground">
                      {f.mse}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-foreground">
                      {f.embeddedBits > 0 ? `${f.embeddedBits} bits` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
