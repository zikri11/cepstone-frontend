"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileCheck2Icon,
  FileTextIcon,
  FileVideoIcon,
  KeyRoundIcon,
  LayersIcon,
  LockIcon,
  PlayCircleIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  UnlockIcon,
  UploadCloudIcon,
  ZapIcon,
} from "lucide-react";

import { StegoProject } from "@/types/stego";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ExtractTabProps {
  projects: StegoProject[];
  onNavigateTab: (tab: "overview" | "embed" | "telemetry" | "history") => void;
  onSuccessExtract?: (project: StegoProject) => void;
}

export function ExtractTab({
  projects,
  onNavigateTab,
  onSuccessExtract,
}: ExtractTabProps) {
  // Stego video candidate list
  const availableStegoVideos = projects.filter(
    (p) => p.status === "embedded" || p.status === "extracted"
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    availableStegoVideos[0]?.id || "proj-01"
  );
  const selectedProject =
    availableStegoVideos.find((p) => p.id === selectedProjectId) ||
    availableStegoVideos[0] ||
    projects[0];

  const [enteredKey, setEnteredKey] = useState(
    selectedProject?.payload?.secretKey || "stego2d-cipher-key-2026"
  );
  const [showKey, setShowKey] = useState(false);

  // Simulation states
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result data
  const [extractedData, setExtractedData] = useState<{
    text: string;
    sizeBytes: number;
    sha256Extracted: string;
    sha256Original: string;
    isMatch: boolean;
    extractedAt: string;
  } | null>(null);

  const handleStartExtraction = () => {
    setErrorMsg(null);
    setIsFinished(false);

    // If key is empty
    if (!enteredKey.trim()) {
      setErrorMsg("Kunci rahasia (Cipher Key) tidak boleh kosong.");
      return;
    }

    setIsExtracting(true);
    setProgress(0);
    setStatusText("Membaca stream video & metadata header...");

    let p = 0;
    const interval = setInterval(() => {
      p += 5;

      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setIsExtracting(false);

        // Check if key matches the payload key
        const actualKey = selectedProject?.payload?.secretKey || "stego2d-cipher-key-2026";
        if (enteredKey.trim() !== actualKey) {
          setErrorMsg(
            "Dekripsi Gagal: Kunci sandi tidak cocok! Data teracak (ciphertext tidak dapat direkonstruksi)."
          );
          setIsFinished(false);
          return;
        }

        const sha =
          selectedProject?.metrics?.sha256Original ||
          "8f4e2c7a10b9d53e7f6a2b8c9e0d1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e";

        const result = {
          text:
            selectedProject?.payload?.content ||
            "KOORDINAT OPERASI: 07°14'28.5\"S 112°47'33.2\"E. STATUS: TERVERIFIKASI AMAN.",
          sizeBytes:
            selectedProject?.payload?.sizeBytes ||
            new Blob([selectedProject?.payload?.content || ""]).size,
          sha256Extracted: sha,
          sha256Original: sha,
          isMatch: true,
          extractedAt: "Baru saja",
        };

        setExtractedData(result);
        setIsFinished(true);

        if (onSuccessExtract && selectedProject) {
          onSuccessExtract(selectedProject);
        }
        return;
      }

      setProgress(p);

      if (p === 20) {
        setStatusText("Mendeteksi frame dinamis berdasarkan selisih inter-frame (\u0394 threshold)...");
      } else if (p === 50) {
        setStatusText("Mengekstraksi bit rahasia dari LSB kanal piksel RGB/YUV...");
      } else if (p === 75) {
        setStatusText("Menjalankan dekripsi stream AES-256-GCM dengan kunci stego...");
      } else if (p === 90) {
        setStatusText("Menghitung cryptographic checksum SHA-256 pada payload...");
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Studio Ekstraksi (Extraction Studio)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Urai stego-video animasi 2D, ambil payload rahasia, dan verifikasi integritas data menggunakan checksum SHA-256.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono py-1 px-2.5">
          Dekripsi: AES-256 + SHA-256
        </Badge>
      </div>

      {/* Main Grid: Input Panel (Left) & Extraction Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Configuration (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <KeyRoundIcon className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Konfigurasi Sumber &amp; Kunci Dekripsi
              </h2>
            </div>

            {/* Stego Video Source Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-foreground">
                Pilih Berkas Stego-Video
              </Label>
              <div className="space-y-2">
                {availableStegoVideos.map((video) => {
                  const isSelected = selectedProjectId === video.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => {
                        setSelectedProjectId(video.id);
                        setEnteredKey(video.payload?.secretKey || "");
                        setIsFinished(false);
                        setErrorMsg(null);
                      }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                          : "border-border/60 bg-background/50 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileVideoIcon className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {video.filename}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {video.resolution} • {video.metrics.psnr} dB
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2Icon className="size-4 text-primary shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secret Key Input */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="extractKey" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <LockIcon className="size-3.5 text-primary" />
                  Kunci Rahasia (Stego Cipher Key)
                </Label>
                <span className="text-[10px] text-muted-foreground">Wajib Cocok</span>
              </div>
              <div className="relative">
                <Input
                  id="extractKey"
                  type={showKey ? "text" : "password"}
                  value={enteredKey}
                  onChange={(e) => setEnteredKey(e.target.value)}
                  placeholder="Ketik kunci rahasia untuk mendekripsi..."
                  className="h-9 pe-9 text-xs font-mono rounded-lg border-border/60 bg-background/50"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showKey ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Kunci ini digunakan untuk merekonstruksi dan mendekripsi payload AES-256 dari frame.
              </p>
            </div>

            {/* Error Message if wrong key */}
            {errorMsg && (
              <Alert variant="destructive" className="py-2.5 px-3 text-xs rounded-lg">
                <ShieldAlertIcon className="size-4" />
                <AlertTitle className="text-xs font-semibold">Gagal Mengekstrak</AlertTitle>
                <AlertDescription className="text-[11px] mt-0.5">
                  {errorMsg}
                </AlertDescription>
              </Alert>
            )}

            {/* Start Extraction Action Button */}
            <button
              type="button"
              disabled={isExtracting || !enteredKey}
              onClick={handleStartExtraction}
              className="w-full h-10 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isExtracting ? (
                <>
                  <span className="size-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  <span>Mengekstrak Frame...</span>
                </>
              ) : (
                <>
                  <UnlockIcon className="size-3.5" />
                  <span>Mulai Ekstraksi &amp; Dekripsi</span>
                </>
              )}
            </button>
          </Card>
        </div>

        {/* Right Column: Execution Output & SHA-256 Verification (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Progress Box while extracting */}
          {isExtracting && (
            <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-6 text-center space-y-4">
              <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Proses Ekstraksi Berlangsung...
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {statusText}
                </p>
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Progress Ekstraksi</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Idle Placeholder */}
          {!isExtracting && !isFinished && (
            <Card className="border-dashed border-border/70 bg-muted/10 p-8 text-center space-y-4">
              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <UnlockIcon className="size-6" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Menunggu Instruksi Ekstraksi
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pilih stego-video di panel kiri dan masukkan kunci stego yang valid, kemudian klik tombol <strong>Mulai Ekstraksi</strong>.
                </p>
              </div>
            </Card>
          )}

          {/* Finished & Verified Output */}
          {isFinished && extractedData && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              {/* Success Integrity Callout */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
                <div className="size-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-500 flex items-center gap-1.5">
                    Ekstraksi Berhasil &amp; Integritas Terverifikasi
                    <Badge variant="outline" className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] py-0">
                      100% Match
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Bit payload berhasil didekripsi dari frame dinamis. Tidak ditemukan korupsi bit atau artefak data.
                  </p>
                </div>
              </div>

              {/* SHA-256 Comparison Card */}
              <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4.5 space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="size-4 text-emerald-500" />
                    <h4 className="text-xs font-semibold text-foreground">
                      Uji Verifikasi Cryptographic Hash (SHA-256)
                    </h4>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30">
                    Checksum Valid
                  </Badge>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-sans">
                      Hash Payload Asli (Saat Penyisipan):
                    </span>
                    <p className="text-[11px] text-foreground/90 bg-muted/30 p-2 rounded border border-border/40 break-all select-all">
                      {extractedData.sha256Original}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-sans">
                      Hash Payload Hasil Ekstraksi:
                    </span>
                    <p className="text-[11px] text-emerald-500 bg-emerald-500/5 p-2 rounded border border-emerald-500/20 break-all select-all">
                      {extractedData.sha256Extracted}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-muted/20 border border-border/40 text-[11px] text-muted-foreground flex items-center gap-2">
                  <FileCheck2Icon className="size-4 text-emerald-500 shrink-0" />
                  <span>
                    Kedua hash bernilai identik (0 perbedaan bit). Integritas transmisi data rahasia sempurna.
                  </span>
                </div>
              </Card>

              {/* Extracted Payload Text Box */}
              <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-4.5 space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="size-4 text-primary" />
                    <h4 className="text-xs font-semibold text-foreground">
                      Pesan Rahasia yang Direkonstruksi
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {extractedData.sizeBytes} bytes ({extractedData.text.length} karakter)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-background/80 border border-border/60 font-mono text-xs text-foreground leading-relaxed break-words whitespace-pre-wrap select-all">
                  {extractedData.text}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(extractedData.text);
                      alert("Teks rahasia telah disalin ke clipboard!");
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-border/60 bg-background/50 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <CopyIcon className="size-3.5" />
                    <span>Salin Pesan Rahasia</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([extractedData.text], {
                          type: "text/plain;charset=utf-8",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `extracted_${selectedProject.filename.replace(".mp4", "")}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <DownloadIcon className="size-3.5" />
                      <span>Unduh Berkas (.txt)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateTab("telemetry")}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-border/70 hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <span>Lihat Analisis Citra</span>
                      <ArrowRightIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
