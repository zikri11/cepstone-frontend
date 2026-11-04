# API Documentation - Steganografi Backend

Base URL: `http://localhost:5000/api`

---

## 1. Get All Projects
Mengambil semua daftar proyek steganografi.

- **URL:** `/projects`
- **Method:** `GET`
- **Response Success (200):**
  ```json
  [
    {
      "id": "uuid-string",
      "title": "Video Rahasia",
      "filename": "video.mp4",
      "fileSize": "15.4 MB",
      "resolution": "1920x1080",
      "fps": 30,
      "duration": "00:03:45",
      "totalFrames": 6750,
      "status": "embedded",
      "createdAt": "2026-09-29T12:00:00.000Z",
      "thumbnailColor": "#333333"
    }
  ]
  ```

---

## 2. Get Project Detail
Mengambil detail satu proyek beserta data metrics dan payload jika ada.

- **URL:** `/projects/:id`
- **Method:** `GET`
- **URL Params:** `id=[string]`
- **Response Success (200):**
  ```json
  {
    "id": "uuid-string",
    "title": "Video Rahasia",
    "filename": "video.mp4",
    "fileSize": "15.4 MB",
    "resolution": "1920x1080",
    "fps": 30,
    "duration": "00:03:45",
    "totalFrames": 6750,
    "status": "embedded",
    "createdAt": "2026-09-29T12:00:00.000Z",
    "thumbnailColor": "#333333",
    "metrics": {
      "psnr": 45.2,
      "ssim": 0.99,
      "mse": 0.05,
      "payloadCapacityBpp": 1.5,
      "payloadSizeBytes": 1024,
      "integrityValid": true,
      "sha256Original": "hash1",
      "sha256Extracted": "hash1"
    },
    "payload": {
      "type": "text",
      "name": null,
      "sizeBytes": 1024,
      "content": "Pesan rahasia",
      "secretKey": "mySecret"
    }
  }
  ```
- **Response Error (404):**
  ```json
  { "message": "Project not found" }
  ```

---

## 3. Get Project Frame Metrics
Mengambil data detail per frame untuk evaluasi pergerakan/dynamic region.

- **URL:** `/projects/:id/frames`
- **Method:** `GET`
- **URL Params:** `id=[string]`
- **Response Success (200):**
  ```json
  [
    {
      "frameNumber": 1,
      "timestamp": "00:00:00.033",
      "motionDelta": 15.2,
      "isDynamicRegion": true,
      "psnr": 42.1,
      "ssim": 0.98,
      "mse": 0.1,
      "embeddedBits": 120
    }
  ]
  ```

---

## 4. Get Activity Logs
Mengambil daftar riwayat aktivitas sistem.

- **URL:** `/activity-logs`
- **Method:** `GET`
- **Response Success (200):**
  ```json
  [
    {
      "id": "uuid-string",
      "timestamp": "2026-09-29T12:00:00.000Z",
      "type": "embed",
      "title": "Embedding Payload",
      "description": "Menyisipkan teks ke video.mp4",
      "status": "completed",
      "badgeText": "Success",
      "metricSummary": "PSNR: 45.2 dB"
    }
  ]
  ```

---

## 5. Health Check
Mengecek status server backend.

- **URL:** `/health`
- **Method:** `GET`
- **Response Success (200):**
  ```json
  {
    "status": "ok",
    "message": "Backend is running"
  }
  ```

---

## 6. Register User
Mendaftarkan akun baru. Password akan dienkripsi menggunakan bcrypt.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Body JSON:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "secretpassword123"
  }
  ```
- **Response Success (201):**
  ```json
  {
    "message": "Registrasi berhasil",
    "userId": "uuid-string"
  }
  ```

---

## 7. Login User
Login untuk mendapatkan JWT (JSON Web Token).

- **URL:** `/auth/login`
- **Method:** `POST`
- **Body JSON:**
  ```json
  {
    "email": "john@example.com",
    "password": "secretpassword123"
  }
  ```
- **Response Success (200):**
  ```json
  {
    "message": "Login berhasil",
    "token": "eyJh...",
    "user": {
      "id": "uuid-string",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```
