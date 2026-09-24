"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDownIcon,
  CheckCircle2Icon,
  DownloadIcon,
  EyeIcon,
  FileCheck2Icon,
  FileVideoIcon,
  FilterIcon,
  HardDriveIcon,
  KeyRoundIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "lucide-react";

import { StegoProject } from "@/types/stego";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HistoryTabProps {
  projects: StegoProject[];
  onDeleteProject?: (id: string) => void;
  onNavigateTab: (tab: "overview" | "embed" | "extract" | "telemetry") => void;
}

export function HistoryTab({
  projects,
  onDeleteProject,
  onNavigateTab,
}: HistoryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "embedded" | "extracted">("all");
  const [sortBy, setSortBy] = useState<"latest" | "psnr" | "payload">("latest");
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<StegoProject | null>(null);

  // Filter and sort computation
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.filename.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.resolution.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "psnr") {
        return b.metrics.psnr - a.metrics.psnr;
      }
      if (sortBy === "payload") {
        return b.metrics.payloadSizeBytes - a.metrics.payloadSizeBytes;
      }
      return 0; // Default: chronological order
    });

    return result;
  }, [projects, searchQuery, statusFilter, sortBy]);

  const countEmbedded = projects.filter((p) => p.status === "embedded").length;
  const countExtracted = projects.filter((p) => p.status === "extracted").length;

  return (
    <div className="space-y-6">
      {/* Tab Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Repositori Riwayat Video Steganografi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manajemen seluruh berkas cover video dan stego-video animasi 2D yang tersimpan di workspace riset.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab("embed")}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusIcon className="size-3.5" />
          <span>Sisipkan Video Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute inset-y-0 start-3 my-auto size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama video atau resolusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 ps-9 text-xs rounded-lg border-border/60 bg-background/50"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Pills */}
            <div className="flex items-center bg-muted/40 p-1 rounded-lg border border-border/50 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua ({projects.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("embedded")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "embedded"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Stego Siap ({countEmbedded})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("extracted")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === "extracted"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Terekstraksi ({countExtracted})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/60 rounded-lg px-2.5 py-1.5 bg-background/50">
              <ArrowUpDownIcon className="size-3 text-muted-foreground shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutkan video"
                className="bg-transparent text-xs text-foreground font-medium outline-none cursor-pointer"
              >
                <option value="latest" className="bg-background text-foreground">Terbaru</option>
                <option value="psnr" className="bg-background text-foreground">PSNR Tertinggi</option>
                <option value="payload" className="bg-background text-foreground">Ukuran Payload</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Data Table */}
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card/60 backdrop-blur-xs shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border/50 select-none">
              <tr>
                <th className="py-3 px-4">Nama Cover Video</th>
                <th className="py-3 px-4">Resolusi &amp; FPS</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Skor PSNR</th>
                <th className="py-3 px-4">Skor SSIM</th>
                <th className="py-3 px-4">Payload Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-xs">
                    Tidak ada video yang cocok dengan kriteria pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr
                    key={proj.id}
                    className="hover:bg-muted/20 transition-colors group cursor-pointer"
                    onClick={() => setSelectedProjectForDetail(proj)}
                  >
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileVideoIcon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-semibold text-foreground truncate max-w-xs group-hover:text-primary transition-colors">
                            {proj.filename}
                          </span>
                          <span className="block text-[11px] text-muted-foreground truncate">
                            {proj.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-mono">
                      {proj.resolution} @ {proj.fps}fps
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-mono">
                      {proj.duration} ({proj.totalFrames}f)
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-emerald-500">
                        {proj.metrics.psnr} dB
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold text-sky-500">
                        {proj.metrics.ssim}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-foreground">
                      {(proj.metrics.payloadSizeBytes / 1024).toFixed(1)} KB
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={
                          proj.status === "embedded"
                            ? "border-primary/30 text-primary bg-primary/5 text-[10px]"
                            : "border-emerald-500/30 text-emerald-500 bg-emerald-500/5 text-[10px]"
                        }
                      >
                        {proj.status === "embedded" ? "Stego Siap" : "Terekstraksi"}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                      {proj.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          title="Inspeksi Telemetri"
                          onClick={() => onNavigateTab("telemetry")}
                          className="size-7 rounded-md border border-border/60 hover:bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <EyeIcon className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Uji Ekstraksi"
                          onClick={() => onNavigateTab("extract")}
                          className="size-7 rounded-md border border-border/60 hover:bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <KeyRoundIcon className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Unduh Berkas Stego"
                          onClick={() => {
                            alert(`Mengunduh berkas ${proj.filename}...`);
                          }}
                          className="size-7 rounded-md border border-border/60 hover:bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <DownloadIcon className="size-3.5" />
                        </button>
                        {onDeleteProject && (
                          <button
                            type="button"
                            title="Hapus Video"
                            onClick={() => {
                              if (confirm(`Hapus video ${proj.filename} dari workspace?`)) {
                                onDeleteProject(proj.id);
                              }
                            }}
                            className="size-7 rounded-md border border-border/60 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2Icon className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary / Pagination */}
        <div className="p-3.5 border-t border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            Menampilkan <strong>{filteredProjects.length}</strong> dari <strong>{projects.length}</strong> video tersimpan
          </span>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded-md border border-border/60 opacity-40 text-xs cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded-md border border-border/60 opacity-40 text-xs cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal / Drawer View */}
      {selectedProjectForDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-200"
          onClick={() => setSelectedProjectForDetail(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border/70 bg-card p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileVideoIcon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {selectedProjectForDetail.filename}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedProjectForDetail.title} • {selectedProjectForDetail.createdAt}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  selectedProjectForDetail.status === "embedded"
                    ? "text-primary border-primary/30"
                    : "text-emerald-500 border-emerald-500/30"
                }
              >
                {selectedProjectForDetail.status === "embedded" ? "Stego Siap" : "Terekstraksi"}
              </Badge>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg border border-border/50 bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-sans">PSNR</span>
                <span className="text-emerald-500 font-bold">{selectedProjectForDetail.metrics.psnr} dB</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border/50 bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-sans">SSIM</span>
                <span className="text-sky-500 font-bold">{selectedProjectForDetail.metrics.ssim}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border/50 bg-muted/20">
                <span className="text-[10px] text-muted-foreground block font-sans">Payload</span>
                <span className="text-foreground font-bold">
                  {(selectedProjectForDetail.metrics.payloadSizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Hash */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <FileCheck2Icon className="size-3.5 text-primary" />
                SHA-256 Checksum Signature
              </span>
              <p className="font-mono text-[11px] text-muted-foreground break-all bg-muted/30 p-2 rounded border border-border/50 select-all">
                {selectedProjectForDetail.metrics.sha256Original}
              </p>
            </div>

            {/* Payload Preview */}
            {selectedProjectForDetail.payload && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-foreground">Pratinjau Pesan Rahasia</span>
                <div className="p-2.5 rounded bg-muted/30 border border-border/50 font-mono text-[11px] text-foreground max-h-24 overflow-y-auto">
                  {selectedProjectForDetail.payload.content}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <button
                type="button"
                onClick={() => setSelectedProjectForDetail(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectForDetail(null);
                    onNavigateTab("extract");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border/70 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  Uji Ekstraksi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectForDetail(null);
                    onNavigateTab("telemetry");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Buka Telemetri
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
