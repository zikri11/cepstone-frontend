"use client";

import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileCheck2Icon,
  FileTextIcon,
  FileVideoIcon,
  HardDriveIcon,
  KeyRoundIcon,
  LayersIcon,
  LockIcon,
  PlayCircleIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SlidersIcon,
  SparklesIcon,
  TrendingUpIcon,
  UploadCloudIcon,
  ZapIcon,
} from "lucide-react";

import { StegoProject } from "@/types/stego";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/components/reui/stepper";

interface EmbedTabProps {
  onSuccessEmbed: (newProject: StegoProject) => void;
  onNavigateTab: (tab: "overview" | "extract" | "telemetry" | "history") => void;
}

export function EmbedTab({ onSuccessEmbed, onNavigateTab }: EmbedTabProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Video Selection
  const [selectedVideo, setSelectedVideo] = useState({
    title: "Anime Run Cycle Scene",
    filename: "naruto_run_loop_1080p.mp4",
    fileSize: "6.4 MB",
    resolution: "1920x1080 (1080p)",
    fps: 24,
    duration: "00:15",
    totalFrames: 360,
    maxCapacityKb: 64,
  });

  // Step 2: Payload & Key
  const [payloadText, setPayloadText] = useState(
    "KOORDINAT OPERASI: 07°14'28.5\"S 112°47'33.2\"E. STATUS: TERVERIFIKASI AMAN."
  );
  const [secretKey, setSecretKey] = useState("stego2d-cipher-key-2026");
  const [showKey, setShowKey] = useState(false);

  // Step 3: Inter-Frame Delta Parameters
  const [thresholdDelta, setThresholdDelta] = useState([12]);
  const [bitPlane, setBitPlane] = useState<1 | 2>(1);

  // Step 4: Execution Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStatusText, setProcessStatusText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<StegoProject | null>(
    null
  );

  // Preset sample videos
  const sampleVideos = [
    {
      title: "Anime Run Cycle Scene",
      filename: "naruto_run_loop_1080p.mp4",
      fileSize: "6.4 MB",
      resolution: "1920x1080 (1080p)",
      fps: 24,
      duration: "00:15",
      totalFrames: 360,
      maxCapacityKb: 64,
    },
    {
      title: "Ghibli Sky Clouds Motion",
      filename: "ghibli_sky_bg_motion.mp4",
      fileSize: "4.1 MB",
      resolution: "1920x1080 (1080p)",
      fps: 24,
      duration: "00:10",
      totalFrames: 240,
      maxCapacityKb: 45,
    },
    {
      title: "Chibi Character Walk",
      filename: "chibi_walk_expression.mp4",
      fileSize: "3.2 MB",
      resolution: "1280x720 (720p)",
      fps: 30,
      duration: "00:08",
      totalFrames: 240,
      maxCapacityKb: 32,
    },
  ];

  // Calculated payload size
  const payloadBytes = new Blob([payloadText]).size;
  const payloadKb = (payloadBytes / 1024).toFixed(2);
  const capacityPercent = Math.min(
    100,
    Math.round((payloadBytes / (selectedVideo.maxCapacityKb * 1024)) * 100)
  );

  // Estimated metrics based on parameters
  const estimatedPsnr = (
    47.2 -
    (bitPlane - 1) * 2.1 -
    (thresholdDelta[0] > 15 ? 0.4 : 0)
  ).toFixed(2);
  const estimatedSsim = (
    0.9935 -
    (bitPlane - 1) * 0.003 -
    (thresholdDelta[0] > 18 ? 0.001 : 0)
  ).toFixed(4);

  // Run embedding simulation
  const handleStartEmbedding = () => {
    setIsProcessing(true);
    setProcessProgress(0);
    setProcessStatusText("Menganalisis pergeseran piksel antar-frame (Inter-Frame Diff)...");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;

      if (progress >= 100) {
        clearInterval(interval);
        setProcessProgress(100);
        setIsProcessing(false);
        setIsCompleted(true);

        const newProj: StegoProject = {
          id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: selectedVideo.title,
          filename: `stego_${selectedVideo.filename}`,
          fileSize: selectedVideo.fileSize,
          resolution: selectedVideo.resolution,
          fps: selectedVideo.fps,
          duration: selectedVideo.duration,
          totalFrames: selectedVideo.totalFrames,
          status: "embedded",
          createdAt: "Baru saja",
          metrics: {
            psnr: parseFloat(estimatedPsnr),
            ssim: parseFloat(estimatedSsim),
            mse: 1.24,
            payloadCapacityBpp: bitPlane === 1 ? 0.88 : 1.45,
            payloadSizeBytes: payloadBytes,
            integrityValid: true,
            sha256Original: "8f4e2c7a10b9d53e7f6a2b8c9e0d1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
            sha256Extracted: "8f4e2c7a10b9d53e7f6a2b8c9e0d1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
          },
          payload: {
            type: "text",
            name: "payload_rahasia.txt",
            sizeBytes: payloadBytes,
            content: payloadText,
            secretKey: secretKey,
          },
          thumbnailColor: "from-blue-600/20 via-indigo-500/10 to-transparent",
        };

        setGeneratedResult(newProj);
        setTimeout(() => {
          onSuccessEmbed(newProj);
        }, 10);
        return;
      }

      setProcessProgress(progress);

      if (progress === 25) {
        setProcessStatusText("Mendeteksi area dinamis gerakan 2D & kontur garis...");
      } else if (progress === 55) {
        setProcessStatusText("Enkripsi AES-256-GCM pada payload rahasia...");
      } else if (progress === 75) {
        setProcessStatusText(`Menyisipkan bit pada LSB channel piksel (\u0394 threshold: ${thresholdDelta[0]})...`);
      } else if (progress === 90) {
        setProcessStatusText("Menghitung indeks kualitas citra akhir (PSNR & SSIM)...");
      }
    }, 120);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Studio Penyisipan (Embedding Studio)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Sematkan data rahasia ke dalam sequence frame video animasi 2D berbasis pergeseran piksel (*inter-frame difference*).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono py-1 px-2.5">
            Metode: Inter-Frame LSB
          </Badge>
        </div>
      </div>

      {/* ReUI Stepper Shell */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-xs p-6 space-y-6">
        <Stepper
          value={currentStep}
          onValueChange={setCurrentStep}
          className="w-full"
        >
          {/* Stepper Navigation Bar */}
          <StepperNav className="mb-6 pb-4 border-b border-border/40">
            <StepperItem step={1}>
              <StepperTrigger className="cursor-pointer">
                <StepperIndicator className="size-6 text-xs">1</StepperIndicator>
                <div className="hidden sm:block text-start">
                  <span className="text-xs font-medium block text-foreground">
                    Cover Video
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Pilih sampel 2D
                  </span>
                </div>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem step={2}>
              <StepperTrigger className="cursor-pointer">
                <StepperIndicator className="size-6 text-xs">2</StepperIndicator>
                <div className="hidden sm:block text-start">
                  <span className="text-xs font-medium block text-foreground">
                    Data Rahasia
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Payload & AES-256
                  </span>
                </div>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem step={3}>
              <StepperTrigger className="cursor-pointer">
                <StepperIndicator className="size-6 text-xs">3</StepperIndicator>
                <div className="hidden sm:block text-start">
                  <span className="text-xs font-medium block text-foreground">
                    Parameter &Delta;
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Threshold & LSB
                  </span>
                </div>
              </StepperTrigger>
              <StepperSeparator />
            </StepperItem>

            <StepperItem step={4}>
              <StepperTrigger className="cursor-pointer">
                <StepperIndicator className="size-6 text-xs">4</StepperIndicator>
                <div className="hidden sm:block text-start">
                  <span className="text-xs font-medium block text-foreground">
                    Eksekusi & Hasil
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Stego Video & PSNR
                  </span>
                </div>
              </StepperTrigger>
            </StepperItem>
          </StepperNav>

          {/* Stepper Panels */}
          <StepperPanel>
            {/* ================= STEP 1: COVER VIDEO ================= */}
            <StepperContent value={1} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Langkah 1: Pilih Cover Video Animasi 2D
                </h2>
                <p className="text-xs text-muted-foreground">
                  Pilih video animasi 2D yang akan dijadikan media pembawa (*carrier/cover*). Karakteristik visual 2D sangat ideal untuk teknik inter-frame.
                </p>
              </div>

              {/* Sample Video Picker Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {sampleVideos.map((video) => {
                  const isSelected = selectedVideo.filename === video.filename;
                  return (
                    <div
                      key={video.filename}
                      onClick={() => setSelectedVideo(video)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                          : "border-border/60 bg-background/50 hover:bg-muted/30"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-primary">
                          <CheckCircle2Icon className="size-4" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <FileVideoIcon className="size-4" />
                        </div>
                        <Badge variant="outline" className="text-[10px] py-0">
                          {video.resolution.split(" ")[1]?.replace("(", "").replace(")", "") || "1080p"}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {video.title}
                      </h4>
                      <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
                        {video.filename}
                      </p>
                      <div className="mt-3 pt-2 border-t border-border/40 grid grid-cols-2 text-[10px] text-muted-foreground">
                        <span>{video.duration} • {video.fps}fps</span>
                        <span className="text-right">{video.fileSize}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload Dropzone Alternative */}
              <div className="p-6 rounded-xl border border-dashed border-border/70 bg-muted/10 text-center space-y-2">
                <UploadCloudIcon className="size-6 text-muted-foreground mx-auto" />
                <p className="text-xs font-medium text-foreground">
                  Atau unggah berkas video animasi 2D kustom (.mp4 / .webm)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Mendukung resolusi hingga 1920x1080 @ 24/30/60 fps
                </p>
              </div>

              {/* Selected Video Specifications */}
              <div className="p-3.5 rounded-lg border border-border/50 bg-muted/20 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Video Terpilih:</span>
                  <span className="font-semibold text-foreground">{selectedVideo.filename}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Kapasitas Maksimal:</span>
                  <span className="font-semibold text-emerald-500">~{selectedVideo.maxCapacityKb} KB payload</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Total Frame:</span>
                  <span className="font-semibold text-foreground">{selectedVideo.totalFrames} frames</span>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <span>Lanjut: Data Rahasia</span>
                  <ArrowRightIcon className="size-3.5" />
                </button>
              </div>
            </StepperContent>

            {/* ================= STEP 2: SECRET PAYLOAD ================= */}
            <StepperContent value={2} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Langkah 2: Masukkan Pesan Rahasia &amp; Kunci Enkripsi
                </h2>
                <p className="text-xs text-muted-foreground">
                  Data rahasia akan dienkripsi dengan standar AES-256-GCM sebelum disisipkan ke dalam piksel selisih antar-frame.
                </p>
              </div>

              {/* Payload Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="payloadText" className="text-xs font-medium text-foreground">
                    Pesan Teks Rahasia
                  </Label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {payloadBytes} bytes ({payloadKb} KB) / maks {selectedVideo.maxCapacityKb} KB
                  </span>
                </div>
                <Textarea
                  id="payloadText"
                  rows={4}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  placeholder="Ketik teks rahasia yang akan disembunyikan..."
                  className="text-xs font-mono rounded-lg border-border/60 bg-background/50 resize-none"
                />
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Kapasitas Digunakan: {capacityPercent}%</span>
                  <span className="text-emerald-500 font-medium">Ruang Aman</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.max(4, capacityPercent)}%` }}
                  />
                </div>
              </div>

              {/* Secret Key Input */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="secretKey" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <KeyRoundIcon className="size-3.5 text-primary" />
                    Kunci Rahasia (Stego Cipher Key)
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Enkripsi AES-256-GCM
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showKey ? "text" : "password"}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Masukkan kunci enkripsi..."
                    className="h-9 pe-9 text-xs rounded-lg border-border/60 bg-background/50 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((prev) => !prev)}
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showKey ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-border/60 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <ArrowLeftIcon className="size-3.5" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!payloadText || !secretKey}
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <span>Lanjut: Parameter Inter-Frame</span>
                  <ArrowRightIcon className="size-3.5" />
                </button>
              </div>
            </StepperContent>

            {/* ================= STEP 3: INTER-FRAME PARAMETERS ================= */}
            <StepperContent value={3} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-foreground">
                  Langkah 3: Konfigurasi Ambang Batas Selisih Antar-Frame (&Delta;)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tentukan sensitivitas deteksi gerakan antar-frame animasi. Frame dengan selisih piksel di atas ambang batas akan dijadikan lokasi penyisipan.
                </p>
              </div>

              {/* Threshold Delta Slider */}
              <div className="p-4 rounded-xl border border-border/60 bg-background/50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <SlidersIcon className="size-3.5 text-primary" />
                      Ambang Batas Selisih Frame (&Delta; Threshold)
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">
                      Nilai ideal animasi 2D: 10 - 15 (Menghindari distorsi pada garis kontur line-art).
                    </span>
                  </div>
                  <span className="text-sm font-bold font-mono text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20">
                    &Delta; = {thresholdDelta[0]}
                  </span>
                </div>

                <div className="pt-2">
                  <Slider
                    value={thresholdDelta}
                    onValueChange={setThresholdDelta}
                    min={5}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                    <span>5 (Sangat Sensitif)</span>
                    <span>12 (Rekomendasi Skripsi)</span>
                    <span>30 (Hanya Gerak Drastis)</span>
                  </div>
                </div>
              </div>

              {/* Bit Plane Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  Pemilihan Bit-Plane Penyisipan (LSB)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setBitPlane(1)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      bitPlane === 1
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                      <span>1-Bit LSB (Direkomendasikan)</span>
                      {bitPlane === 1 && <CheckCircle2Icon className="size-3.5 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Kualitas tertinggi (PSNR &gt; 46 dB). Benar-benar tidak terdeteksi mata manusia.
                    </p>
                  </div>

                  <div
                    onClick={() => setBitPlane(2)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                      bitPlane === 2
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border/60 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                      <span>2-Bit LSB (Kapasitas Ganda)</span>
                      {bitPlane === 2 && <CheckCircle2Icon className="size-3.5 text-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Kapasitas 2x lipat (PSNR ~43 dB). Tetap berada di atas batas aman 40 dB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time Metric Prediction Card */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                  <SparklesIcon className="size-3.5" />
                  <span>Estimasi Output Evaluasi Kualitas</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Estimasi PSNR:</span>
                    <span className="text-sm font-semibold font-mono text-emerald-500">
                      ~{estimatedPsnr} dB
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Estimasi SSIM:</span>
                    <span className="text-sm font-semibold font-mono text-sky-500">
                      ~{estimatedSsim}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Lokasi Sisip:</span>
                    <span className="text-sm font-semibold font-mono text-foreground">
                      Frame Dinamis
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-border/60 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <ArrowLeftIcon className="size-3.5" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <span>Lanjut: Eksekusi</span>
                  <ArrowRightIcon className="size-3.5" />
                </button>
              </div>
            </StepperContent>

            {/* ================= STEP 4: EXECUTION & RESULTS ================= */}
            <StepperContent value={4} className="space-y-6">
              {!isCompleted && !isProcessing && (
                <div className="space-y-5 text-center py-4">
                  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <ZapIcon className="size-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h2 className="text-base font-semibold text-foreground">
                      Siap Menjalankan Penyisipan Steganografi
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Algoritma akan memproses <strong>{selectedVideo.totalFrames} frames</strong> video cover <em>{selectedVideo.filename}</em> dengan ambang batas &Delta;={thresholdDelta[0]}.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleStartEmbedding}
                      className="inline-flex items-center gap-2 h-10 px-6 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer"
                    >
                      <PlayCircleIcon className="size-4" />
                      <span>Jalankan Simulasi Penyisipan</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Progress Simulation Bar */}
              {isProcessing && (
                <div className="p-6 rounded-xl border border-border/60 bg-muted/20 space-y-4 text-center">
                  <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Memproses Steganografi Inter-Frame...
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      {processStatusText}
                    </p>
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                      <span>Proses Pipeline</span>
                      <span>{processProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-150"
                        style={{ width: `${processProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Completed Results Display */}
              {isCompleted && generatedResult && (
                <div className="space-y-5 animate-in fade-in-50 duration-300">
                  {/* Success Banner */}
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-500">
                        Penyisipan Berhasil &amp; Stego-Video Siap!
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Data rahasia telah disematkan pada piksel gerakan frame dinamis tanpa merusak kualitas visual animasi 2D.
                      </p>
                    </div>
                  </div>

                  {/* Evaluated Actual Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Card className="p-3 border-border/60 bg-background/50">
                      <span className="text-[11px] text-muted-foreground block">Nilai PSNR Aktual</span>
                      <span className="text-xl font-bold font-mono text-emerald-500">
                        {generatedResult.metrics.psnr} dB
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        Ambang batas 40 dB terpenuhi
                      </span>
                    </Card>

                    <Card className="p-3 border-border/60 bg-background/50">
                      <span className="text-[11px] text-muted-foreground block">Nilai SSIM Aktual</span>
                      <span className="text-xl font-bold font-mono text-sky-500">
                        {generatedResult.metrics.ssim}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        Struktur 99.2% identik
                      </span>
                    </Card>

                    <Card className="p-3 border-border/60 bg-background/50">
                      <span className="text-[11px] text-muted-foreground block">Payload Tersemat</span>
                      <span className="text-xl font-bold font-mono text-foreground">
                        {generatedResult.metrics.payloadSizeBytes} B
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        Terenkripsi AES-256
                      </span>
                    </Card>

                    <Card className="p-3 border-border/60 bg-background/50">
                      <span className="text-[11px] text-muted-foreground block">Integritas Checksum</span>
                      <span className="text-xl font-bold font-mono text-purple-500 flex items-center gap-1">
                        <FileCheck2Icon className="size-4" />
                        Valid
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5 truncate">
                        SHA-256 Match
                      </span>
                    </Card>
                  </div>

                  {/* Checksum Hash Verification Card */}
                  <div className="p-3.5 rounded-lg border border-border/50 bg-muted/20 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <ShieldCheckIcon className="size-3.5 text-primary" />
                        Payload SHA-256 Hash Signature
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedResult.metrics.sha256Original);
                          alert("Hash SHA-256 telah disalin ke clipboard!");
                        }}
                        className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CopyIcon className="size-3" />
                        Salin Hash
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground break-all bg-background/60 p-2 rounded border border-border/40">
                      {generatedResult.metrics.sha256Original}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCompleted(false);
                        setCurrentStep(1);
                      }}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-border/60 hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <RefreshCwIcon className="size-3.5" />
                      <span>Uji Video Lain</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Mengunduh berkas ${generatedResult.filename} (Simulasi Stego Video)...`);
                        }}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <DownloadIcon className="size-3.5" />
                        <span>Unduh Stego-Video MP4</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateTab("extract")}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-medium border border-border/70 bg-background/50 hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <KeyRoundIcon className="size-3.5" />
                        <span>Uji di Studio Ekstraksi</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </StepperContent>
          </StepperPanel>
        </Stepper>
      </Card>
    </div>
  );
}
