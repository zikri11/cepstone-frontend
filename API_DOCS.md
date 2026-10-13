# API Documentation — StegoAnim 2D Backend

Dokumentasi lengkap REST API untuk sistem Steganografi Video Animasi 2D Berbasis Inter-Frame Difference dan LSB dengan enkripsi AES-256-GCM.

- **Base URL:** `http://localhost:5000/api`
- **Static Assets:** `http://localhost:5000/outputs`
- **Authentication:** Bearer Token JWT via Header `Authorization: Bearer <TOKEN>`

---

## 1. Autentikasi (`/auth`)

### 1.1 Register Pengguna
Mendaftarkan akun baru. Password dienkripsi menggunakan bcrypt (salt 10 rounds). Otomatis mengembalikan token JWT untuk auto-login.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Header:** `Content-Type: application/json`
- **Body JSON:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "secretpassword123"
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "message": "Registrasi berhasil",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "uuid-string",
    "user": {
      "id": "uuid-string",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```
- **Response Error (400 Bad Request):**
  ```json
  { "message": "Email atau nama pengguna sudah digunakan" }
  ```

---

### 1.2 Login Pengguna
Autentikasi kredensial pengguna dan menghasilkan token JWT dengan masa aktif 7 hari.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Header:** `Content-Type: application/json`
- **Body JSON:**
  ```json
  {
    "email": "john@example.com",
    "password": "secretpassword123"
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Login berhasil",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```
- **Response Error (401 Unauthorized):**
  ```json
  { "message": "Email atau kata sandi tidak cocok" }
  ```

---

### 1.3 Ambil Profil Pengguna Saat Ini (`/me`)
Mengambil data profil pengguna yang sedang login berdasarkan token JWT.

- **URL:** `/auth/me`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):**
  ```json
  {
    "user": {
      "id": "uuid-string",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2026-10-13T12:00:00.000Z"
    }
  }
  ```

---

### 1.4 Update Profil Pengguna
Memperbarui nama pengguna atau email.

- **URL:** `/auth/profile`
- **Method:** `PUT`
- **Header:** `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`
- **Body JSON:**
  ```json
  {
    "username": "johndoe_updated",
    "email": "john_new@example.com"
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "message": "Profil berhasil diperbarui",
    "user": {
      "id": "uuid-string",
      "username": "johndoe_updated",
      "email": "john_new@example.com"
    }
  }
  ```

---

### 1.5 Ganti Kata Sandi
Mengubah kata sandi dengan memvalidasi kata sandi lama.

- **URL:** `/auth/change-password`
- **Method:** `PUT`
- **Header:** `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`
- **Body JSON:**
  ```json
  {
    "oldPassword": "secretpassword123",
    "newPassword": "newsecretpassword456"
  }
  ```
- **Response Success (200 OK):**
  ```json
  { "message": "Kata sandi berhasil diperbarui" }
  ```

---

## 2. Mesin Steganografi (`/stego`)

### 2.1 Penyisipan Pesan / Embed Payload
Menyisipkan pesan rahasia (teks/data) ke dalam area dinamis video animasi 2D berdasarkan ambang selisih antar-frame (*inter-frame difference*). Jika `secretKey` diisi, payload akan dienkripsi secara otomatis menggunakan cipher **AES-256-GCM** sebelum proses LSB bitplane embedding.

- **URL:** `/stego/embed`
- **Method:** `POST`
- **Header:** `Authorization: Bearer <TOKEN>`, `Content-Type: multipart/form-data`
- **Form Data:**
  - `video` (File, binary video `.mp4`, `.avi`, `.mov`)
  - `payload` (String, teks/pesan yang ingin disisipkan)
  - `threshold` (Number, default `12`)
  - `bitPlane` (Number, `1` atau `2`, default `1`)
  - `secretKey` (String, opsional: kunci enkripsi AES-256-GCM)
  - `title` (String, opsional: judul proyek)
- **Response Success (201 Created):**
  ```json
  {
    "id": "proj-uuid",
    "userId": "user-uuid",
    "title": "Anime Run Cycle",
    "filename": "stego_result_a1b2c3d4.avi",
    "fileSize": "6.4 MB",
    "resolution": "1920x1080",
    "fps": 24,
    "duration": "00:00:15",
    "totalFrames": 360,
    "status": "embedded",
    "videoUrl": "/outputs/stego_result_a1b2c3d4.avi",
    "thumbnailColor": "from-blue-600/20 via-indigo-500/10 to-transparent",
    "metrics": {
      "psnr": 46.12,
      "ssim": 0.9924,
      "mse": 1.22,
      "payloadCapacityBpp": 0.88,
      "payloadSizeBytes": 1024,
      "integrityValid": true,
      "sha256Original": "8f4e2c7a10b9d53e...",
      "sha256": "8f4e2c7a10b9d53e..."
    },
    "payload": {
      "type": "text",
      "name": "pesan_rahasia.txt",
      "sizeBytes": 1024,
      "content": "KOORDINAT OPERASI RAHASIA",
      "secretKey": "my-secret-key"
    },
    "framesEvaluated": 360,
    "framesEmbedded": 240
  }
  ```

---

### 2.2 Ekstraksi Pesan / Extract Payload
Mengekstrak payload tersembunyi dari video steganografi. Dapat dilakukan via upload video atau memilih `projectId` dari proyek yang sudah ada. Jika payload terenkripsi, cipher key akan didekripsi menggunakan AES-256-GCM.

- **URL:** `/stego/extract`
- **Method:** `POST`
- **Header:** `Authorization: Bearer <TOKEN>`, `Content-Type: multipart/form-data`
- **Form Data:**
  - `video` (File, opsional jika menyertakan `projectId`)
  - `projectId` (String, opsional jika menyertakan file `video`)
  - `threshold` (Number, default `12`)
  - `bitPlane` (Number, `1` atau `2`, default `1`)
  - `secretKey` (String, kunci dekripsi jika payload terenkripsi)
- **Response Success (200 OK):**
  ```json
  {
    "status": "extracted",
    "message": "Pesan rahasia berhasil diekstrak dan diverifikasi",
    "extractedPayload": "KOORDINAT OPERASI RAHASIA",
    "sizeBytes": 1024,
    "integrityValid": true,
    "sha256Extracted": "8f4e2c7a10b9d53e...",
    "sha256Original": "8f4e2c7a10b9d53e...",
    "framesEvaluated": 360,
    "framesExtracted": 240,
    "extractedAt": "2026-10-13T12:00:00.000Z"
  }
  ```
- **Response Error (400 Bad Request):**
  ```json
  { "error": "Kunci rahasia (Cipher Key) tidak valid atau salah. Gagal mendekripsi payload." }
  ```

---

### 2.3 Verifikasi Integritas SHA-256
Memverifikasi kecocokan hash SHA-256 antara payload asli dan hasil ekstraksi untuk memastikan data tidak terkorupsi.

- **URL:** `/stego/verify`
- **Method:** `POST`
- **Header:** `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`
- **Body JSON:**
  ```json
  {
    "projectId": "proj-uuid",
    "originalHash": "8f4e2c7a10b9d53e...",
    "extractedHash": "8f4e2c7a10b9d53e..."
  }
  ```
- **Response Success (200 OK):**
  ```json
  {
    "valid": true,
    "sha256Original": "8f4e2c7a10b9d53e...",
    "sha256Extracted": "8f4e2c7a10b9d53e...",
    "matchMessage": "Integritas 100% Cocok (Payload tidak mengalami distorsi)"
  }
  ```

---

## 3. Manajemen Proyek (`/projects`)

### 3.1 Ambil Semua Proyek
Mengambil daftar proyek steganografi milik pengguna yang login dengan opsi filter dan pengurutan.

- **URL:** `/projects`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Query Params:**
  - `status` (`all`, `embedded`, `extracted`, `processing`, `ready`)
  - `search` (pencarian teks pada judul/nama file/resolusi)
  - `sortBy` (`latest`, `psnr`, `payload`)
- **Response Success (200 OK):** Array of `StegoProject`.

---

### 3.2 Ambil Detail Proyek
Mengambil detail satu proyek beserta data metrics kualitas (PSNR, SSIM, MSE) dan payload yang disisipkan.

- **URL:** `/projects/:id`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):** Objek `StegoProject` lengkap.

---

### 3.3 Hapus Proyek
Menghapus proyek beserta relasi metrics, payload, frame metrics, serta membersihkan file video stego dari penyimpanan server.

- **URL:** `/projects/:id`
- **Method:** `DELETE`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):**
  ```json
  {
    "message": "Proyek dan seluruh dependensi data berhasil dihapus",
    "id": "proj-uuid"
  }
  ```

---

### 3.4 Ambil Telemetri Frame Proyek
Mengambil data detail evaluasi frame-by-frame untuk analisis dynamic region, delta gerak, MSE, PSNR, dan bit embedding per frame.

- **URL:** `/projects/:id/frames`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):**
  ```json
  [
    {
      "frameNumber": 1,
      "timestamp": "00:00.04",
      "motionDelta": 4.2,
      "isDynamicRegion": false,
      "psnr": 48.5,
      "ssim": 0.996,
      "mse": 0.85,
      "embeddedBits": 0
    },
    {
      "frameNumber": 2,
      "timestamp": "00:00.08",
      "motionDelta": 16.4,
      "isDynamicRegion": true,
      "psnr": 45.9,
      "ssim": 0.992,
      "mse": 1.25,
      "embeddedBits": 1024
    }
  ]
  ```

---

### 3.5 Ekspor Laporan Proyek
Mengekspor laporan audit proyek dalam format JSON atau CSV.

- **URL:** `/projects/:id/export?format=json` atau `?format=csv`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Response:** File attachment JSON atau CSV dengan header `Content-Disposition`.

---

## 4. Statistik & Ringkasan (`/overview/stats`)

### 4.1 Ambil Statistik Workspace
Menghitung agregasi statistik real-time: total video, rata-rata PSNR, SSIM, MSE, total kapasitas payload, serta ringkasan aktivitas terbaru.

- **URL:** `/overview/stats` (alias: `/stats`)
- **Method:** `GET`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):**
  ```json
  {
    "totalVideos": 24,
    "averagePsnr": 45.32,
    "averageSsim": 0.9918,
    "averageMse": 1.38,
    "totalPayloadKb": 142.8,
    "visualArtifactRate": "0.00%",
    "detectionSafety": "Imperceptible",
    "statusCounts": {
      "embedded": 12,
      "extracted": 8,
      "processing": 0,
      "ready": 4
    },
    "recentActivities": [...]
  }
  ```

---

## 5. Log Aktivitas & Audit (`/activity-logs`)

### 5.1 Ambil Riwayat Aktivitas
- **URL:** `/activity-logs`
- **Method:** `GET`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Query Params:** `limit=20`, `type=embed|extract|verify|export`
- **Response Success (200 OK):** Array of `ActivityLog`.

### 5.2 Tambah Log Aktivitas Manual
- **URL:** `/activity-logs`
- **Method:** `POST`
- **Header:** `Authorization: Bearer <TOKEN>`, `Content-Type: application/json`
- **Body JSON:**
  ```json
  {
    "type": "verify",
    "title": "Audit Telemetri Frame",
    "description": "Analisis komparasi frame-by-frame 360 frame video aksi.",
    "status": "completed",
    "badgeText": "Audit Sukses",
    "metricSummary": "Rata-rata MSE: 1.84"
  }
  ```

### 5.3 Bersihkan Riwayat Aktivitas
- **URL:** `/activity-logs`
- **Method:** `DELETE`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):**
  ```json
  { "message": "Semua riwayat aktivitas berhasil dibersihkan" }
  ```

---

## 6. Seed Data Sampel (`/seed`)

### 6.1 Populasi Proyek Sampel
Menambahkan 3 contoh proyek steganografi realistis beserta metrics, payload, dan log aktivitas ke akun pengguna untuk pengujian instan.

- **URL:** `/seed`
- **Method:** `POST`
- **Header:** `Authorization: Bearer <TOKEN>`
- **Response Success (200 OK):**
  ```json
  { "message": "Seeder berhasil. 3 sampel proyek steganografi telah ditambahkan ke akun Anda." }
  ```

---

## 7. Media Streaming (`/media`)

### 7.1 Streaming Video (HTTP 206 Partial Content)
Mendukung header `Range: bytes=start-end` untuk pemutaran video HTML5 `<video>` yang mulus dan pencarian durasi (*scrubbing*).

- **URL:** `/media/stream/:filename`
- **Method:** `GET`
- **Response:** HTTP 206 Partial Content Stream.
