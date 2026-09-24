/**
 * StegoAnim 2D - TypeScript Type Definitions
 * Domain: Steganografi Video Animasi 2D Berbasis Inter-Frame Difference
 */

export interface StegoMetrics {
  psnr: number; // Peak Signal-to-Noise Ratio (dB) - target > 40 dB
  ssim: number; // Structural Similarity Index (0.0000 - 1.0000)
  mse: number; // Mean Squared Error (lower is better)
  payloadCapacityBpp: number; // Bits per pixel payload rate
  payloadSizeBytes: number; // Total hidden payload bytes
  integrityValid: boolean; // SHA-256 integrity match
  sha256Original: string; // Hash payload sebelum disisipkan
  sha256Extracted: string; // Hash payload hasil ekstraksi
}

export interface PayloadData {
  type: "text" | "file";
  name?: string;
  sizeBytes: number;
  content: string; // Raw text or base64
  secretKey: string;
}

export interface StegoProject {
  id: string;
  title: string;
  filename: string;
  fileSize: string;
  resolution: string;
  fps: number;
  duration: string;
  totalFrames: number;
  status: "embedded" | "extracted" | "processing" | "ready";
  createdAt: string;
  metrics: StegoMetrics;
  payload: PayloadData;
  thumbnailColor: string; // Subtle visual gradient placeholder
}

export interface FrameMetric {
  frameNumber: number;
  timestamp: string;
  motionDelta: number; // Inter-frame difference threshold metric
  isDynamicRegion: boolean; // Apakah frame memenuhi ambang batas pergerakan
  psnr: number; // PSNR frame ini
  ssim: number; // SSIM frame ini
  mse: number; // MSE frame ini
  embeddedBits: number; // Jumlah bit yang disisipkan pada frame
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: "embed" | "extract" | "verify" | "export";
  title: string;
  description: string;
  status: "completed" | "in_progress" | "failed";
  badgeText: string;
  metricSummary?: string;
}

export interface EmbeddingParameters {
  thresholdDelta: number; // Nilai ambang selisih frame (default 12)
  bitPlane: 1 | 2; // LSB 1-bit atau 2-bit
  encryptionAlgorithm: "AES-256-GCM" | "None";
  secretKey: string;
  payloadText: string;
}
