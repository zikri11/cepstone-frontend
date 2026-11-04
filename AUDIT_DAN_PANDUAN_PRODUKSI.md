# Dokumen Audit Sistem, Matriks Perbaikan, & Panduan Produksi StegoAnim 2D

> **Proyek Capstone**: Sistem Steganografi Video Animasi 2D Berbasis Inter-Frame Difference dan LSB dengan Enkripsi AES-256-GCM  
> **Status Dokumen**: Hasil Audit Menyeluruh (Frontend & Backend)  
> **Tanggal Rilis**: Oktober 2026  

---

## 📋 Daftar Isi
1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Matriks Temuan Audit & Solusi Teknis](#2-matriks-temuan-audit--solusi-teknis)
3. [Arsitektur Autentikasi, Lupa Password & RBAC](#3-arsitektur-autentikasi-lupa-password--rbac)
4. [Penyelarasan Algoritma dengan Flowchart Metodologi](#4-penyelarasan-algoritma-dengan-flowchart-metodologi)
5. [Roadmap Pembersihan Frontend (Menghapus Data Dummy)](#5-roadmap-pembersihan-frontend-menghapus-data-dummy)
6. [Panduan Kesiapan Deployment ke VPS / Cloud](#6-panduan-kesiapan-deployment-ke-vps--cloud)
7. [Checklist Pengujian Sidang Capstone](#7-checklist-pengujian-sidang-capstone)

---

## 1. Ringkasan Eksekutif

Sistem **StegoAnim 2D** menggabungkan antarmuka modern (Next.js 16 + Tailwind CSS) dengan backend pemrosesan citra komputer (Express.js + OpenCV Python 3.12). 

Secara teoritis dan eksperimental, integrasi metode **Inter-Frame Difference ($\Delta$)** dan **Least Significant Bit (LSB)** dengan enkripsi simetris **AES-256-GCM** telah terbukti menghasilkan kualitas visual yang sangat tinggi (PSNR > 45 dB, SSIM > 0.99) pada video animasi 2D. 

Namun, agar sistem dapat digunakan oleh banyak pengguna secara aman (*production-ready*) dan siap dipresentasikan di hadapan dosen penguji, beberapa komponen esensial wajib distandarkan: keamanan autentikasi pengguna (*Register, Login, Lupa Password, RBAC*), proteksi rute halaman, isolasi database, serta pembersihan data dummy.

---

## 2. Matriks Temuan Audit & Solusi Teknis

| No | Modul | Kondisi Saat Ini | Risiko / Kekurangan | Solusi Teknis Wajib |
|:--:|:---|:---|:---|:---|
| **1** | **Lupa Password** | Tombol di `auth-form.tsx:194` hanya memunculkan `alert()`. Backend belum memiliki endpoint. | Pengguna tidak dapat memulihkan akses jika lupa kata sandi. | Buat endpoint `POST /api/auth/forgot-password` (token kriptografi 15 menit) & `POST /api/auth/reset-password` serta halaman UI `/forgot-password` & `/reset-password`. |
| **2** | **Role-Based Access (RBAC)** | Tabel `users` hanya menyimpan `id, username, email, password`. | Tidak ada pemisahan hak akses antara mahasiswa/peneliti biasa dengan dosen/administrator. | Tambahkan kolom `role VARCHAR(20) DEFAULT 'user'`, middleware `authorize(['admin'])`, dan panel pemantau admin. |
| **3** | **Proteksi Rute Frontend** | Belum ada `middleware.ts` di Next.js. Siapapun bisa membuka `/dashboard` langsung. | Celah akses data dan pengalaman pengguna yang ambigu (menampilkan data mock jika belum login). | Pasang Next.js Route Guard Middleware yang mengecek token auth dan me-redirect tamu ke `/login`. |
| **4** | **Parameter $\Delta$ Proyek** | Ambang batas $\Delta$ dan bit plane belum tersimpan di riwayat proyek `projects`. | Saat ekstraksi dari proyek, parameter harus ditebak manual. | Simpan `threshold` dan `bit_plane` ke database proyek saat embed agar ekstraksi otomatis tersinkronisasi 100%. |
| **5** | **Pemutaran Video Stego** | Video hasil stego memakai codec *lossless* `FFV1 (.avi)` yang tidak didukung tag HTML5 browser. | Video hasil embed tidak bisa langsung diputar di peramban web Chrome/Edge. | Sediakan berkas master `.avi` (untuk ekstraksi data lossless) dan file preview `.mp4` (H.264) untuk diputar di web. |
| **6** | **Data Dummy Tab Telemetri** | 20 baris metrik frame di tab Telemetri masih membaca array `mockFrameMetrics`. | Hasil analisis citra tidak mencerminkan video yang baru saja di-embed. | Hubungkan tab Telemetri ke endpoint backend `GET /api/projects/:id/frames`. |
| **7** | **Data Dummy Tab Overview** | Kartu statistik "24 Video", "45.32 dB", dll. masih data statis `overviewStats`. | Statistik ringkasan tidak bertambah ketika pengguna menyisipkan video baru. | Hubungkan tab Overview ke endpoint backend `GET /api/overview/stats`. |
| **8** | **Environment VPS Linux** | Path Python di `.env` masih hardcode Windows `C:/Users/.../python.exe`. | Server akan *crash* saat dijalankan di server Linux / VPS cloud. | Gunakan deteksi cerdas `process.env.PYTHON_PATH || 'python3' || 'python'`. |

---

## 3. Arsitektur Autentikasi, Lupa Password & RBAC

### A. Skema Database yang Diperbarui (`schema.sql`)
Struktur tabel pengguna kini mengakomodasi kontrol peran dan token pemulihan kata sandi:

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    reset_password_token VARCHAR(100) DEFAULT NULL,
    reset_password_expires TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B. Peran Pengguna (RBAC Breakdown)

| Peran (Role) | Hak Akses & Kemampuan Sistem | Batasan |
|:---|:---|:---|
| **User (Mahasiswa / Penguji)** | • Melakukan penyisipan pesan (*embed*) ke video pribadi.<br>• Melakukan ekstraksi & dekripsi pesan rahasia.<br>• Melihat riwayat video & telemetri milik akunnya sendiri.<br>• Mengubah profil dan kata sandi sendiri. | • Tidak bisa melihat proyek atau video milik akun lain.<br>• Tidak bisa melihat daftar seluruh pengguna.<br>• Tidak bisa mengakses metrik infrastruktur server. |
| **Admin (Dosen / Administrator)** | • Memiliki semua hak akses User.<br>• Membuka tab/halaman khusus **Admin Dashboard**.<br>• Melihat daftar seluruh user terdaftar beserta jumlah proyek mereka.<br>• Memantau kapasitas penyimpanan folder `uploads/` dan `outputs/`.<br>• Menghapus akun bermasalah atau membersihkan berkas usang. | • Tetap tidak dapat membaca teks pesan terenkripsi milik user tanpa kunci AES yang valid. |

### C. Alur Lengkap Fitur Lupa Password
1. **Permintaan Reset (`POST /api/auth/forgot-password`)**:
   - Pengguna memasukkan alamat email yang terdaftar.
   - Backend memverifikasi keberadaan email.
   - Backend menghasilkan token acak aman kriptografi 32-byte (`crypto.randomBytes(32).toString('hex')`).
   - Token disimpan di database dengan masa berlaku 15 menit (`Date.now() + 15 * 60 * 1000`).
   - **Mode Produksi**: Mengirimkan email berisi tautan `https://domain.com/reset-password?token=...`.
   - **Mode Demo / Sidang**: Mengembalikan tautan reset langsung pada respons JSON / pop-up notifikasi untuk kemudahan demonstrasi tanpa memerlukan koneksi SMTP eksternal.
2. **Validasi & Pembaruan (`POST /api/auth/reset-password`)**:
   - Menerima `token` dan `newPassword`.
   - Backend memvalidasi apakah token cocok dan belum kedaluwarsa.
   - Kata sandi baru di-hash menggunakan `bcryptjs` (salt 10 rounds).
   - Menghapus token reset dari database untuk mencegah penggunaan ulang (*single-use token*).

---

## 4. Penyelarasan Algoritma dengan Flowchart Metodologi

Berdasarkan flowchart metodologi capstone:

```
[Mulai Program] ──► [Pilih Mode]
   │
   ├─► [EMBED]:  Input Video & Pesan ──► Ekstraksi Frame ──► Hitung Interframe Diff
   │             ──► Pilih Frame (Threshold) ──► Sisipkan Pesan (LSB)
   │             ──► Rekonstruksi Video Stego ──► Unduh Video Stego ──► [Selesai]
   │
   └─► [EXTRACT]: Input Video Stego ──► Ekstraksi Frame ──► Hitung Interframe Diff
                 ──► Identifikasi Frame Pesan ──► Ekstrak Bit LSB
                 ──► Susun Ulang Pesan ──► Tampilkan Pesan ──► [Selesai]
```

### Titik Krusial Sinkronisasi:
1. **Parameter $\Delta$ Tersimpan**: Saat proses *Embed*, nilai `threshold` (misal $\Delta = 6.5$) disimpan langsung di baris database proyek. Ketika user memilih video tersebut di tab *Extract*, sistem secara otomatis mengatur slider $\Delta$ ke $6.5$.
2. **Karakteristik Video Animasi 2D**:
   - Animasi 2D memiliki frame statis berulang (*held frames*) saat karakter diam, dan lonjakan gerak tinggi (*keyframe animation*).
   - Ambang batas optimal untuk animasi 2D berkisar antara $\Delta = 4.0$ hingga $8.0$.
3. **Integritas SHA-256**:
   - SHA-256 dihitung sebelum penyisipan ($H_{orig}$) dan sesudah ekstraksi ($H_{extr}$).
   - Status integritas **100% Match** membuktikan bahwa tidak ada satu bit pun yang terdistorsi selama proses penyisipan maupun ekstraksi.

---

## 5. Roadmap Pembersihan Frontend (Menghapus Data Dummy)

Berikut adalah berkas-berkas yang perlu dilepaskan dari ketergantungan `stego-mock-data.ts`:

1. **`src/components/dashboard/tabs/overview-tab.tsx`**:
   - Hapus impor `overviewStats`.
   - Tambahkan pemanggilan `fetchOverviewStats()` ke `/api/overview/stats`.
   - Hitung rata-rata PSNR dan total video secara riil dari database pengguna.
2. **`src/components/dashboard/tabs/telemetry-tab.tsx`**:
   - Tambahkan *dropdown* pemilih proyek yang ingin diaudit telemetrinya.
   - Ambil data frame riil dari `GET /api/projects/:id/frames` saat proyek dipilih.
3. **`src/components/dashboard/tabs/history-tab.tsx`**:
   - Hapus 5 proyek fiktif (*Naruto*, *Ghibli*, *Chibi*, dll.).
   - Hanya tampilkan proyek yang benar-benar diunggah oleh pengguna yang sedang login.
4. **`src/components/dashboard/dashboard-header.tsx`**:
   - Ganti avatar statis dengan tombol profil interaktif yang menampilkan nama pengguna, role (`user`/`admin`), dan tombol **Logout** yang membersihkan `localStorage`.

---

## 6. Panduan Kesiapan Deployment ke VPS / Cloud

### A. Persiapan Variabel Lingkungan (`.env`)
Untuk Backend di server Linux:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=gunakan_kunci_acak_64_karakter_sangat_kuat
DATABASE_URL=postgresql://user:password@localhost:5432/stegoanim_db
PYTHON_PATH=/usr/bin/python3
CLIENT_ORIGIN=https://stegoanim.yourdomain.com
```

### B. Konfigurasi Docker (`docker-compose.yml`)
Untuk kemudahan satu perintah jalan di server (`docker compose up -d`):
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: stego_db
    restart: always
    environment:
      POSTGRES_USER: stego_user
      POSTGRES_PASSWORD: stego_password
      POSTGRES_DB: stegoanim_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./BACKEND/schema.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./BACKEND
      dockerfile: Dockerfile
    container_name: stego_backend
    restart: always
    environment:
      - PORT=5000
      - DATABASE_URL=postgresql://stego_user:stego_password@db:5432/stegoanim_db
      - PYTHON_PATH=python3
    ports:
      - "5000:5000"
    volumes:
      - ./BACKEND/uploads:/app/uploads
      - ./BACKEND/outputs:/app/outputs
    depends_on:
      - db

  frontend:
    build:
      context: ./FRONTEND
      dockerfile: Dockerfile
    container_name: stego_frontend
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### C. Nginx Reverse Proxy & SSL (HTTPS)
Konfigurasi Nginx di VPS:
```nginx
server {
    server_name stegoanim.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 100M;
    }

    location /outputs {
        proxy_pass http://localhost:5000;
        client_max_body_size 100M;
    }
}
```

---

## 7. Checklist Pengujian Sidang Capstone

Gunakan daftar centang ini sebelum demonstrasi sidang tugas akhir:

- [ ] **Alur Registrasi Baru**: Daftarkan akun baru, pastikan langsung dialihkan ke dashboard dengan kondisi daftar proyek masih bersih (0 proyek).
- [ ] **Pengujian Embed Video Nyata**:
  - [ ] Unggah berkas animasi 2D lokal (format `.mp4`).
  - [ ] Masukkan pesan rahasia teks dan tentukan kunci sandi AES.
  - [ ] Sesuaikan $\Delta$ threshold (misal $\Delta = 5$).
  - [ ] Pastikan metrik PSNR (> 40 dB) dan SSIM (> 0.98) muncul di layar.
  - [ ] Unduh berkas stego-video hasil rekonsiliasi.
- [ ] **Pengujian Ekstraksi Video**:
  - [ ] Masuk ke tab Ekstraksi, pilih opsi *Unggah Berkas*.
  - [ ] Masukkan kunci sandi yang sama.
  - [ ] Atur $\Delta$ ke nilai yang sama saat penyisipan.
  - [ ] Pastikan pesan rahasia muncul sama persis dan status SHA-256 menampilkan *100% Match*.
  - [ ] Uji dengan kunci sandi salah $\rightarrow$ pastikan muncul notifikasi error yang tepat.
- [ ] **Uji Lupa Password**:
  - [ ] Logout dari dashboard.
  - [ ] Klik "Lupa kata sandi", masukkan email, ikuti tautan reset, perbarui kata sandi, dan login kembali dengan kata sandi baru.
- [ ] **Uji RBAC**:
  - [ ] Login menggunakan akun Admin $\rightarrow$ verifikasi akses ke tab Admin/Audit.
  - [ ] Login menggunakan akun Mahasiswa/User biasa $\rightarrow$ pastikan hanya melihat proyek miliknya sendiri.

---
*Dokumen ini diperbarui secara berkala seiring berjalannya tahapan implementasi.*
