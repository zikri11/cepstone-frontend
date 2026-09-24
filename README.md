# StegoAnim 2D — Frontend Capstone Project

> **Penerapan Steganografi Video Animasi 2D Berbasis Inter-Frame Difference untuk Komunikasi Data Aman**  
> *Tugas Capstone Projek Teknik Informatika • 2026*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix_Nova-000000?style=for-the-badge)](https://ui.shadcn.com/)
[![ReUI Registry](https://img.shields.io/badge/ReUI-Registry_Components-2563eb?style=for-the-badge)](https://reui.io/)

---

## 📌 Deskripsi Proyek

Repository ini memuat antarmuka pengguna (*Frontend*) untuk sistem **Steganografi Video Animasi 2D** yang memanfaatkan karakteristik pergeseran piksel antar-frame (*Inter-Frame Difference*). 

Dalam animasi 2D, terdapat area diam (*held frames*) dan area gerak dinamis bergaris kontur tegas (*line-art*). Dengan menyisipkan data rahasia hanya pada area dengan nilai selisih frame dinamis $\Delta(x,y,t) > \text{threshold}$, distorsi visual dapat diminimalkan hingga mata manusia tidak dapat melihat perbedaannya (*imperceptible*), dengan capaian nilai **PSNR > 45 dB** dan **SSIM > 0.99**.

---

## ✨ Fitur Utama

### 1. 🏠 Landing Page Komprehensif
- **Hero & Value Proposition**: Menjelaskan konsep keamanan komunikasi data melalui media video animasi 2D.
- **Workflow & Metodologi**: Visualisasi alur Inter-Frame Difference dari ekstraksi frame, enkripsi AES-256, hingga embedding LSB.
- **Hasil Riset & FAQ**: Rangkuman pengujian matematis kualitas citra dan jawaban pertanyaan seputar riset.

### 2. 🔐 Autentikasi Minimalis (Vercel Style)
- Tampilan responsif satu layar (*single-screen viewport without vertical scroll*).
- **Password Strength Indicator**: Indikator kekuatan kata sandi 2px minimalis dari ReUI yang hanya aktif pada halaman pendaftaran (`/signup`) dan dinonaktifkan pada halaman login (`/login`).
- Integrasi tombol masuk dengan Google dan tautan langsung ke Workspace.

### 3. 📊 Dashboard Workspace (Tabbed Command Center)
- **Tab 1: Ringkasan (Overview)**
  - 4 Kartu KPI Utama Riset: Cover Video Diuji, Rata-rata PSNR (45.32 dB), Rata-rata SSIM (0.9918), Kapasitas Payload (142.8 KB).
  - Grafik Kurva Evaluasi Citra Antar-Frame interaktif (SVG) dengan inspeksi hover per-frame.
  - Linimasa aktivitas pemrosesan *real-time* berbasis komponen `@reui/timeline`.
- **Tab 2: Studio Penyisipan (Embed)**
  - Alur 4 langkah terstruktur berbasis `@reui/stepper`:
    1. *Pilih Cover Video*: Preset video animasi (1080p/720p @ 24/30fps) & dropzone kustom.
    2. *Data Rahasia & AES-256*: Input pesan teks/file dan kunci sandi stego.
    3. *Parameter $\Delta$ Threshold*: Slider ambang batas selisih frame dan pilihan 1-bit / 2-bit LSB.
    4. *Simulasi & Hasil*: Animasi progress frame-by-frame, skor aktual PSNR/SSIM, dan unduh stego video.
- **Tab 3: Studio Ekstraksi (Extract)**
  - Ekstraksi payload dari stego-video menggunakan kunci cipher.
  - **Verifikasi Kriptografis SHA-256 Checksum**: Membuktikan integritas data 100% cocok (*Match / Valid*).
  - Ekspor/unduh berkas teks hasil ekstraksi (`.txt`).
- **Tab 4: Analisis Komparasi (Telemetry)**
  - **Dual-Mode Visual Inspector**:
    - *Side-by-Side*: Frame Asli vs Frame Stego berdampingan untuk menguji *imperceptibility*.
    - *Difference Heatmap*: Visualisasi area pergeseran piksel $\Delta$ tempat bit disematkan.
  - Slider penjelajah sequence 20 frame.
  - Tabel telemetri frame-by-frame lengkap.
  - **Ekspor Data**: Fitur unduh berkas CSV & JSON untuk lampiran laporan skripsi.
- **Tab 5: Repositori Riwayat (History)**
  - Manajemen seluruh video stego yang pernah diproses.
  - Pencarian teks, filter status (*Semua, Stego Siap, Terekstraksi*), dan pengurutan (*Sort by PSNR / Payload*).
  - Modal rincian metadata dan Signature Checksum.

---

## 🛠️ Tech Stack & Dependensi

- **Core Framework**: [Next.js 16.3.4](https://nextjs.org/) (Turbopack, App Router)
- **UI Library**: [React 19.2.8](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Design Primitives**: [shadcn/ui](https://ui.shadcn.com/) (Radix-Nova Style)
- **Advanced Components**: [ReUI Registry](https://reui.io/) (`@reui/stepper`, `@reui/timeline`, `password-input`)
- **Animation**: [Motion v13](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
- Node.js versi 20.x atau lebih baru
- pnpm (`npm install -g pnpm`)

### Instalasi

1. **Clone Repository**:
   ```bash
   git clone https://github.com/zikri11/frontend-capstone.git
   cd frontend-capstone
   ```

2. **Instal Dependensi**:
   ```bash
   pnpm install
   ```

3. **Konfigurasi Environment (Opsional)**:
   Salin `.env.example` menjadi `.env.local` jika ingin menambahkan lisensi ReUI:
   ```bash
   cp .env.example .env.local
   ```

4. **Jalankan Server Development**:
   ```bash
   pnpm dev
   ```

5. Buka di browser:
   - Landing Page: [http://localhost:3000](http://localhost:3000)
   - Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Registrasi Akun: [http://localhost:3000/signup](http://localhost:3000/signup)
   - Masuk Akun: [http://localhost:3000/login](http://localhost:3000/login)

---

## 📁 Struktur Direktori

```text
├── src/
│   ├── app/
│   │   ├── dashboard/        # Halaman Workspace Dashboard (5 Tab Command Center)
│   │   ├── login/            # Halaman Masuk Akun
│   │   ├── signup/           # Halaman Pendaftaran Akun
│   │   ├── layout.tsx        # Layout Global Root & Theme Provider
│   │   └── page.tsx          # Landing Page Utama
│   ├── components/
│   │   ├── dashboard/        # Komponen Dashboard Header & 5 Tab Views
│   │   │   └── tabs/         # OverviewTab, EmbedTab, ExtractTab, TelemetryTab, HistoryTab
│   │   ├── reui/             # Komponen Registry ReUI (Stepper, Timeline, Password Input)
│   │   ├── template/         # Template Form Auth (Vercel-inspired Auth Form & Visual)
│   │   └── ui/               # Komponen Dasar shadcn (Button, Card, Slider, Badge, Input, dll)
│   ├── lib/
│   │   ├── site-config.ts    # Konfigurasi Metadata Situs
│   │   ├── stego-mock-data.ts# Dataset Simulasi Video Animasi 2D & Telemetri
│   │   └── utils.ts          # Utility Class Merging (clsx + tailwind-merge)
│   └── types/
│       └── stego.ts          # Definisi Tipe TypeScript Steganografi
├── components.json           # Konfigurasi shadcn & ReUI Registry
├── package.json              # Definisi Paket & Script Proyek
└── README.md                 # Dokumentasi Resmi Proyek
```

---

## 📄 Lisensi

Dikembangkan sebagai bagian dari Tugas Capstone Projek Teknik Informatika • 2026.
MIT License.
