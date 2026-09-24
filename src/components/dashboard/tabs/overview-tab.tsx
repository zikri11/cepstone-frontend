"use client";

import { useState } from "react";
import {
  ActivityIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  FileVideoIcon,
  HardDriveIcon,
  InfoIcon,
  KeyRoundIcon,
  LayersIcon,
  SparklesIcon,
  TrendingUpIcon,
  UploadCloudIcon,
  ZapIcon,
} from "lucide-react";

import { ActivityLog, FrameMetric } from "@/types/stego";
import { mockFrameMetrics, overviewStats } from "@/lib/stego-mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";

interface OverviewTabProps {
  onNavigateTab: (tab: "embed" | "extract" | "telemetry" | "history") => void;
  activities: ActivityLog[];
}

export function OverviewTab({ onNavigateTab, activities }: OverviewTabProps) {
  const [hoveredFrame, setHoveredFrame] = useState<FrameMetric | null>(null);

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 160;
  const paddingX = 35;
  const paddingY = 25;

  // Scales for PSNR (min: 42, max: 50)
  const minPsnr = 42;
  const maxPsnr = 50;

  const getCoordinates = (index: number, psnr: number) => {
    const x =
      paddingX +
      (index / (mockFrameMetrics.length - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      ((psnr - minPsnr) / (maxPsnr - minPsnr)) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  // Generate SVG path for line and area
  const points = mockFrameMetrics.map((f, i) => getCoordinates(i, f.psnr));
  const linePath = points.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
    ""
  );
  const areaPath = `${linePath} L ${points[points.length - 1].x},${
    chartHeight - paddingY
  } L ${points[0].x},${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Ringkasan Workspace Riset
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Evaluasi steganografi video animasi 2D berbasis pergeseran piksel antar-frame (<em>inter-frame difference</em>).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab("embed")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-colors cursor-pointer"
          >
            <UploadCloudIcon className="size-3.5" />
            <span>Sisipkan Pesan Baru</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("extract")}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/70 bg-background/50 hover:bg-muted/40 transition-colors cursor-pointer"
          >
            <KeyRoundIcon className="size-3.5" />
            <span>Ekstraksi Video</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Metrik Inti Skripsi) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Cover Videos */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Cover Video Diuji</span>
            <FileVideoIcon className="size-4 text-primary" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {overviewStats.totalVideos}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <span className="text-emerald-500 font-medium">2D Animasi</span> • 24 & 30 FPS
            </p>
          </div>
        </Card>

        {/* Metric 2: Average PSNR */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Rata-rata PSNR</span>
            <TrendingUpIcon className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-semibold tracking-tight text-foreground flex items-baseline gap-1">
              {overviewStats.averagePsnr}
              <span className="text-xs font-normal text-muted-foreground">dB</span>
            </div>
            <p className="text-[11px] text-emerald-500 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2Icon className="size-3" />
              Sangat Baik (&gt; 40 dB)
            </p>
          </div>
        </Card>

        {/* Metric 3: Average SSIM */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Rata-rata SSIM</span>
            <SparklesIcon className="size-4 text-sky-500" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {overviewStats.averageSsim}
            </div>
            <p className="text-[11px] text-sky-500 font-medium mt-0.5 flex items-center gap-1">
              <span>Struktur Identik (0.99)</span>
            </p>
          </div>
        </Card>

        {/* Metric 4: Total Payload & Safety */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Kapasitas Payload</span>
            <HardDriveIcon className="size-4 text-purple-500" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-semibold tracking-tight text-foreground flex items-baseline gap-1">
              {overviewStats.totalPayloadKb}
              <span className="text-xs font-normal text-muted-foreground">KB</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Deteksi Artefak: <span className="text-foreground font-medium">0.00%</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Interactive Quality Curve Chart (Evaluasi PSNR Antar-Frame) */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Evaluasi Kualitas Citra Antar-Frame (PSNR vs Frame Sequence)
              </h2>
              <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20 py-0">
                Ambang Batas &gt; 40 dB Terpenuhi
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Grafik fluktuasi PSNR saat penyisipan data pada frame dinamis vs frame statis video animasi.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" />
              <span>PSNR Frame (dB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500/80 inline-block" />
              <span>Standar Minimal (40 dB)</span>
            </div>
          </div>
        </div>

        {/* SVG Curve Display */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 overflow-visible"
          >
            <defs>
              <linearGradient id="psnrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[42, 44, 46, 48, 50].map((val) => {
              const y =
                chartHeight -
                paddingY -
                ((val - minPsnr) / (maxPsnr - minPsnr)) *
                  (chartHeight - paddingY * 2);
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-border/40"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-muted-foreground font-mono"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Threshold Line (40 dB equivalent or baseline at 42) */}
            <line
              x1={paddingX}
              y1={chartHeight - paddingY}
              x2={chartWidth - paddingX}
              y2={chartHeight - paddingY}
              stroke="rgba(239, 68, 68, 0.6)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Area Fill */}
            <path d={areaPath} fill="url(#psnrGradient)" />

            {/* Main PSNR Line */}
            <path
              d={linePath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Frame Data Circles */}
            {mockFrameMetrics.map((f, i) => {
              const { x, y } = getCoordinates(i, f.psnr);
              const isHovered = hoveredFrame?.frameNumber === f.frameNumber;

              return (
                <g
                  key={f.frameNumber}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredFrame(f)}
                  onMouseLeave={() => setHoveredFrame(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5.5 : 3}
                    className={
                      f.isDynamicRegion
                        ? "fill-primary stroke-background stroke-2 transition-all"
                        : "fill-muted-foreground/60 stroke-background stroke-2 transition-all"
                    }
                  />
                  {/* Invisible larger hover area */}
                  <circle cx={x} cy={y} r={12} fill="transparent" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hovered Frame Info Bar */}
        <div className="h-9 px-3 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between text-xs">
          {hoveredFrame ? (
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="font-medium text-foreground">
                Frame #{hoveredFrame.frameNumber} ({hoveredFrame.timestamp})
              </span>
              <span className="text-emerald-500 font-semibold">
                PSNR: {hoveredFrame.psnr} dB
              </span>
              <span className="text-sky-500">
                SSIM: {hoveredFrame.ssim}
              </span>
              <span className="text-muted-foreground">
                Delta Gerak (&Delta;): {hoveredFrame.motionDelta}
              </span>
              <Badge
                variant="outline"
                className={
                  hoveredFrame.isDynamicRegion
                    ? "text-[10px] text-primary border-primary/30"
                    : "text-[10px] text-muted-foreground border-border/60"
                }
              >
                {hoveredFrame.isDynamicRegion ? "Frame Dinamis (Disisipkan)" : "Frame Statis"}
              </Badge>
            </div>
          ) : (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <InfoIcon className="size-3 text-muted-foreground" />
              Arahkan kursor ke titik grafik untuk memeriksa metrik detail per-frame.
            </span>
          )}

          <button
            type="button"
            onClick={() => onNavigateTab("telemetry")}
            className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            Lihat Analisis Lengkap
            <ArrowRightIcon className="size-3" />
          </button>
        </div>
      </Card>

      {/* Bottom Grid: Algorithm Insight & ReUI Timeline Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inter-Frame Difference Explanation & Quick Studio Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              onClick={() => onNavigateTab("embed")}
              className="p-4 rounded-xl border border-border/70 bg-background/50 hover:bg-muted/30 transition-all cursor-pointer group space-y-3"
            >
              <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <UploadCloudIcon className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  Studio Penyisipan (Embed)
                  <ArrowRightIcon className="size-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Sematkan data rahasia berbasis pergeseran frame dinamis animasi 2D dengan parameter LSB & AES-256.
                </p>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab("extract")}
              className="p-4 rounded-xl border border-border/70 bg-background/50 hover:bg-muted/30 transition-all cursor-pointer group space-y-3"
            >
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <KeyRoundIcon className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors flex items-center gap-1.5">
                  Studio Ekstraksi (Extract)
                  <ArrowRightIcon className="size-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Urai stego-video dan verifikasi integritas pesan rahasia menggunakan pencocokan SHA-256 Checksum.
                </p>
              </div>
            </div>
          </div>

          {/* Algorithm Methodology Card */}
          <div className="p-4.5 rounded-xl border border-border/60 bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ZapIcon className="size-4 text-amber-500" />
                <h3 className="text-xs font-semibold text-foreground tracking-tight">
                  Karakteristik Inter-Frame Difference pada Animasi 2D
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] py-0 text-muted-foreground">
                Riset Skripsi
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Animasi 2D memiliki karakteristik khas berupa area statis (<em>held frames</em>) dan area dinamis dengan kontur garis tegas (<em>line-art</em>). Pendekatan <em>Inter-Frame Difference</em> mendeteksi selisih piksel &Delta;(x,y,t) = |F(t) - F(t-1)| untuk menyisipkan payload hanya pada frame dengan pergerakan tinggi, sehingga distorsi kasat mata diminimalkan secara drastis.
            </p>
          </div>
        </div>

        {/* Right 1 Col: ReUI Timeline Recent Activities */}
        <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ActivityIcon className="size-4 text-primary" />
              <h3 className="text-xs font-semibold text-foreground">
                Aktivitas Pipeline Terkini
              </h3>
            </div>
            <span className="text-[10px] text-muted-foreground">Real-time</span>
          </div>

          {/* ReUI Timeline Component */}
          <Timeline className="pt-2">
            {activities.map((act, idx) => (
              <TimelineItem key={act.id} step={idx + 1}>
                <TimelineHeader>
                  <TimelineDate className="text-[10px] text-muted-foreground">
                    {act.timestamp}
                  </TimelineDate>
                  <TimelineTitle className="text-xs font-medium text-foreground">
                    {act.title}
                  </TimelineTitle>
                </TimelineHeader>
                <TimelineIndicator className="size-2 bg-primary" />
                {idx < activities.length - 1 && <TimelineSeparator />}
                <TimelineContent className="text-[11px] text-muted-foreground/80 pb-3">
                  <p>{act.description}</p>
                  {act.metricSummary && (
                    <span className="inline-block mt-1 text-[10px] font-mono text-foreground/80 bg-muted/50 px-1.5 py-0.5 rounded">
                      {act.metricSummary}
                    </span>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    </div>
  );
}
