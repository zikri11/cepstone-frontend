"use client";

import { useState, useEffect } from "react";
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  FileVideoIcon,
  PlusIcon,
} from "lucide-react";

import { FrameMetric, StegoProject } from "@/types/stego";
import { fetchProjectFrames } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface TelemetryTabProps {
  projects?: StegoProject[];
  onNavigateTab?: (tab: "embed" | "extract" | "overview" | "history") => void;
}

export function TelemetryTab({ projects = [], onNavigateTab }: TelemetryTabProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => projects[0]?.id || "");
  const [frames, setFrames] = useState<FrameMetric[]>([]);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);

  const activeProjectId = selectedProjectId || projects[0]?.id || "";

  useEffect(() => {
    if (!activeProjectId) return;
    let isCancelled = false;
    fetchProjectFrames(activeProjectId)
      .then((data) => {
        if (!isCancelled) {
          setFrames(Array.isArray(data) ? data : []);
          setSelectedFrameIndex(0);
        }
      })
      .catch(() => {
        if (!isCancelled) setFrames([]);
      });
    return () => { isCancelled = true; };
  }, [activeProjectId]);

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const dynamicFrames = frames.filter((f) => f.isDynamicRegion).length;
  const totalBits = frames.reduce((acc, f) => acc + (f.embeddedBits || 0), 0);

  // If user has 0 projects, show clean educational empty state
  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              Analisis Komparasi Citra (Telemetry &amp; Frame Diff)
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Inspeksi visual per-frame antara cover video asli dan stego-video untuk membuktikan aspek ketidaktampakan (<em>imperceptibility</em>).
            </p>
          </div>
        </div>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <FileVideoIcon className="size-7" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-base font-semibold text-foreground">
              Belum Ada Data Telemetri Citra
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Anda belum memproses video steganografi apa pun pada akun ini. Silakan lakukan penyisipan pesan rahasia pada video cover di tab <strong>Penyisipan (Embed)</strong> terlebih dahulu untuk melihat telemetri dan analisis selisih gerak per-frame secara objektif.
            </p>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab("embed")}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <PlusIcon className="size-4" />
              <span>Mulai Penyisipan Video</span>
            </button>
          )}
        </Card>
      </div>
    );
  }

  // Export handlers
  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            projectTitle: currentProject?.title || "Evaluasi Steganografi Video Animasi 2D",
            filename: currentProject?.filename || "video.mp4",
            metrics: currentProject?.metrics,
            algorithm: "Inter-Frame Difference + LSB",
            frameSequence: frames,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `telemetri_${currentProject?.filename || "video"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = "Frame,Timestamp,Delta_Motion,Region_Type,PSNR_dB,SSIM,MSE,Bits_Embedded\n";
    const rows = frames
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
    link.setAttribute("download", `evaluasi_${currentProject?.filename || "frames"}.csv`);
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

      {/* Project Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-card/60 border border-border/60 rounded-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileVideoIcon className="size-4 text-primary shrink-0" />
          <span className="text-xs font-medium text-foreground whitespace-nowrap">Proyek Video:</span>
          {projects.length === 0 ? (
            <span className="text-xs text-muted-foreground font-mono">
              (Belum ada proyek tersimpan)
            </span>
          ) : (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="h-8 px-2.5 text-xs font-mono rounded-lg border border-border/70 bg-background text-foreground max-w-xs sm:max-w-md truncate cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.filename} — PSNR: {p.metrics?.psnr || 0} dB ({p.resolution})
                </option>
              ))}
            </select>
          )}
        </div>

        {currentProject ? (
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Ambang Batas: &Delta; = {currentProject.threshold || 12}</span>
            <span>•</span>
            <span>Bit Plane: LSB {currentProject.bitPlane || 1}-bit</span>
          </div>
        ) : (
          onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab("embed")}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusIcon className="size-3.5" />
              Proses Video Baru
            </button>
          )
        )}
      </div>

      {/* Real Telemetry Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4">
          <span className="text-[11px] text-muted-foreground block">Ambang Batas (&Delta;)</span>
          <div className="text-xl font-semibold text-foreground mt-1">
            &Delta; = {currentProject?.threshold || 12}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Filter Frame Dinamis</p>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4">
          <span className="text-[11px] text-muted-foreground block">Frame Dinamis (Disisipi)</span>
          <div className="text-xl font-semibold text-primary mt-1">
            {dynamicFrames} <span className="text-xs font-normal text-muted-foreground">/ {frames.length} Frame</span>
          </div>
          <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
            {frames.length > 0 ? ((dynamicFrames / frames.length) * 100).toFixed(0) : 0}% Wilayah Gerak
          </p>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4">
          <span className="text-[11px] text-muted-foreground block">Kualitas Citra Objektif</span>
          <div className="text-xl font-semibold text-emerald-500 mt-1">
            {currentProject?.metrics?.psnr || 0} <span className="text-xs font-normal text-muted-foreground">dB</span>
          </div>
          <p className="text-[10px] text-sky-500 font-medium mt-0.5">
            SSIM: {currentProject?.metrics?.ssim || 0} (Imperceptible)
          </p>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4">
          <span className="text-[11px] text-muted-foreground block">Kapasitas Muatan Bit</span>
          <div className="text-xl font-semibold text-foreground mt-1">
            {totalBits.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">bits</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            LSB {currentProject?.bitPlane || 1}-bit per piksel
          </p>
        </Card>
      </div>

      {/* Frame-by-Frame Data Table */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Tabel Telemetri Rangkaian Frame Animasi ({frames.length} Frame)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Data evaluasi citra per-frame terukur langsung dari OpenCV Python.
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
              {frames.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-muted-foreground text-xs font-mono">
                    Sedang memuat data telemetri frame...
                  </td>
                </tr>
              ) : (
                frames.map((f, i) => {
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
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
