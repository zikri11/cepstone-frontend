# Panduan Perbaikan & Peningkatan Backend StegoAnim 2D

> **Dokumen untuk Tim Backend**  
> **Target Branch**: `backend-root` / `feat/stego-engine`  
> **Status Audit**: Arsitektur dasar dan engine Python sudah tepat arahnya, namun terdapat **3 Bug Kritis (Showstopper)** dan **1 Masalah Isolasi Data User** yang wajib diperbaiki sebelum dihubungkan ke Frontend.

---

## 📋 Daftar Isi
1. [Ringkasan Evaluasi](#1-ringkasan-evaluasi)
2. [Isu 1: Manajemen Proyek Per-User (Multi-User Data Isolation)](#2-isu-1-manajemen-proyek-per-user-multi-user-data-isolation)
3. [Isu 2: Bug Fatal Ekstraksi Pesan Kosong di `engine/extract.py`](#3-isu-2-bug-fatal-ekstraksi-pesan-kosong-di-engineextractpy)
4. [Isu 3: Potensi Crash Server `ENOENT` (Folder Uploads & Outputs)](#4-isu-3-potensi-crash-server-enoent-folder-uploads--outputs)
5. [Isu 4: Folder `node_modules` Ter-commit ke Git](#5-isu-4-folder-nodemodules-ter-commit-ke-git)
6. [Langkah-Langkah Kode Solusi Siap Pakai](#6-langkah-langkah-kode-solusi-siap-pakai)

---

## 1. Ringkasan Evaluasi

Langkah pembuatan endpoint `POST /api/stego/embed`, `POST /api/stego/extract`, dan penggunaan script Python OpenCV (`embed.py` dan `extract.py`) dengan encoding lossless `FFV1 (.avi)` **sudah sangat tepat secara teori steganografi**.

Namun, sistem saat ini belum bisa digunakan secara stabil dan aman karena:
1. **Tidak Ada Kepemilikan Data**: Akun yang login tidak terhubung ke proyek. Semua user melihat proyek yang sama secara global.
2. **Ekstraksi Gagal**: Logika pemotongan bit di `extract.py` salah hitung antara satuan karakter (*byte*) dan bit. Hasil ekstraksi selalu teks kosong.
3. **Server Rentan Crash**: Jika folder `uploads` atau `outputs` belum dibuat manual di server, proses upload/embed langsung melempar error 500.

---

## 2. Isu 1: Manajemen Proyek Per-User (Multi-User Data Isolation)

### Masalah:
* Backend sudah memiliki endpoint registrasi (`/auth/register`) dan login (`/auth/login`) yang menghasilkan token JWT.
* Namun, pada tabel `projects` dan `activity_logs`, **tidak ada kolom `user_id`**.
* Endpoint `GET /api/projects` mengambil semua data proyek tanpa filter pemilik.
* Akibatnya: User A bisa melihat, mengakses, dan menghapus video steganografi milik User B.

### Solusi yang Diperlukan:
1. Tambahkan relasi `user_id` (Foreign Key ke tabel `users`) pada tabel `projects` dan `activity_logs`.
2. Buat middleware `authenticateToken` untuk memverifikasi JWT dari header `Authorization: Bearer <token>`.
3. Pasang middleware tersebut pada endpoint proyek, dan filter query SQL:
   `WHERE user_id = ?`

---

## 3. Isu 2: Bug Fatal Ekstraksi Pesan Kosong di `engine/extract.py`

### Masalah:
Di `engine/embed.py`, panjang pesan yang disimpan pada 32-bit header adalah **jumlah karakter teks**:
```python
# len(payload) menghitung jumlah karakter (misal: "KASIMO" = 6 karakter)
binary_payload = format(len(payload), '032b') + string_to_binary(payload)
```

Namun di `engine/extract.py`, bit payload dibaca sejumlah nilai panjang karakter tersebut:
```python
payload_length = int(extracted_bits[:32], 2) # nilainya 6
payload_binary = extracted_bits[32:32 + payload_length] # HANYA MEMBACA 6 BIT!
```

**Dampak**:
1 karakter teks membutuhkan **8 bit (1 byte)**. Jika payload berisi 6 karakter ("KASIMO"), dibutuhkan $6 \times 8 = 48$ bit. Karena hanya dibaca 6 bit, fungsi `binary_to_string()` tidak bisa membentuk 1 karakter pun (`len < 8`), dan hasilnya **pasti selalu string kosong `""`**.

### Solusi:
Di `engine/extract.py`, kalikan `payload_length` dengan 8:
```python
total_bits = payload_length * 8
payload_binary = extracted_bits[32:32 + total_bits]
```

---

## 4. Isu 3: Potensi Crash Server `ENOENT` (Folder Uploads & Outputs)

### Masalah:
* Multer menyimpan file ke folder `uploads/`.
* Python menyimpan video hasil stego ke folder `outputs/`.
* Jika folder tersebut belum ada di komputer/server rekan atau penguji, server Node.js dan script Python langsung melempar error:
  `Error: ENOENT: no such file or directory`.

### Solusi:
Tambahkan pembuatan folder otomatis di baris awal `index.js`:
```javascript
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });
if (!fs.existsSync('outputs')) fs.mkdirSync('outputs', { recursive: true });
```

---

## 5. Isu 4: Folder `node_modules` Ter-commit ke Git (✅ SUDAH DIPERBAIKI)

### Status:
* Rekan Anda telah menghapus tracking `node_modules/` pada commit terbaru `ae2889c` (`chore: remove node_modules from git`).
* Saat dicek ulang di repositori GitHub, seluruh berkas `node_modules/` kini sudah **bersih 100% (0 files)** dari branch `backend-root` dan `backend`.
* Poin ini sudah **SELESAI** dan tidak perlu tindakan lagi.

---

## 6. Langkah-Langkah Kode Solusi Siap Pakai

Berikut adalah kode yang bisa langsung diterapkan ke file backend:

### A. Perubahan Skema Database (`schema.sql`)
Jalankan perintah SQL ini di database MySQL Anda:
```sql
-- 1. Tambah kolom user_id pada tabel projects
ALTER TABLE projects ADD COLUMN user_id VARCHAR(36) NOT NULL AFTER id;
ALTER TABLE projects ADD CONSTRAINT fk_projects_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 2. Tambah kolom user_id pada tabel activity_logs
ALTER TABLE activity_logs ADD COLUMN user_id VARCHAR(36) NOT NULL AFTER id;
ALTER TABLE activity_logs ADD CONSTRAINT fk_logs_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

---

### B. Pembuatan Middleware Auth & Update `index.js`
Tambahkan middleware verifikasi JWT di `index.js`:

```javascript
// Middleware untuk memeriksa token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak: Token autentikasi tidak ditemukan' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'rahasia-super-aman', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid atau telah kedaluwarsa' });
    }
    req.user = user; // Menyimpan info user (id, username, email) ke req.user
    next();
  });
};
```

Gunakan `authenticateToken` pada endpoint-endpoint berikut:

#### 1. Mengambil Proyek Spesifik Milik User (`GET /api/projects`):
```javascript
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    const projects = rows.map(mapProjectToCamelCase);
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

#### 2. Mengambil Detail Proyek (`GET /api/projects/:id`):
```javascript
app.get('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    const [projectRows] = await db.query(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );
    
    if (projectRows.length === 0) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }
    
    const project = mapProjectToCamelCase(projectRows[0]);
    
    // Fetch Metrics
    const [metricRows] = await db.query('SELECT * FROM metrics WHERE project_id = ?', [projectId]);
    if (metricRows.length > 0) {
      project.metrics = mapMetricsToCamelCase(metricRows[0]);
    }
    
    // Fetch Payload
    const [payloadRows] = await db.query('SELECT * FROM payloads WHERE project_id = ?', [projectId]);
    if (payloadRows.length > 0) {
      project.payload = mapPayloadToCamelCase(payloadRows[0]);
    }
    
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

#### 3. Menyimpan Proyek Stego dengan ID Pemilik (`POST /api/stego/embed`):
```javascript
app.post('/api/stego/embed', authenticateToken, upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Video file is required' });
  }
  
  const userId = req.user.id;
  const videoPath = req.file.path;
  const { payload, threshold = 12, bitPlane = 1, secretKey } = req.body;
  
  if (!payload) {
    return res.status(400).json({ error: 'Payload is required' });
  }
  
  const pythonProcess = spawn('python', [
    path.join(__dirname, 'engine', 'embed.py'),
    videoPath,
    payload,
    threshold,
    bitPlane,
    path.join(__dirname, 'outputs')
  ]);
  
  let outputData = '';
  pythonProcess.stdout.on('data', (data) => { outputData += data.toString(); });
  pythonProcess.stderr.on('data', (data) => { console.error(`Python Error: ${data}`); });
  
  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Steganography engine failed' });
    }
    
    try {
      const jsonStr = outputData.substring(outputData.indexOf('{'));
      const result = JSON.parse(jsonStr);
      
      if (result.projectId) {
        const projectId = result.projectId;
        const metricId = crypto.randomUUID();
        
        // Simpan proyek dengan menyertakan user_id
        await db.query(
          'INSERT INTO projects (id, user_id, title, filename, file_size, resolution, fps, duration, total_frames, status, thumbnail_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          [projectId, userId, 'Stego Project', req.file.filename, req.file.size + ' B', result.resolution, result.fps, result.duration, result.totalFrames, 'embedded', '#000000']
        );
        
        await db.query(
          'INSERT INTO metrics (id, project_id, psnr, ssim, mse, payload_capacity_bpp, payload_size_bytes, integrity_valid, sha256_original, sha256_extracted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [metricId, projectId, result.metrics.psnr, result.metrics.ssim, result.metrics.mse, result.metrics.payloadCapacityBpp, result.metrics.payloadSizeBytes, result.metrics.integrityValid, result.metrics.sha256Original, result.metrics.sha256]
        );
        
        const payloadId = crypto.randomUUID();
        await db.query(
          'INSERT INTO payloads (id, project_id, type, name, size_bytes, content, secret_key) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [payloadId, projectId, 'text', 'hidden_message.txt', result.metrics.payloadSizeBytes, payload, secretKey || '']
        );
        
        // Catat activity log milik user yang bersangkutan
        const logId = crypto.randomUUID();
        await db.query(
          'INSERT INTO activity_logs (id, user_id, type, title, description, status, badge_text, metric_summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [logId, userId, 'embed', 'Penyisipan Pesan Selesai', `Menyisipkan pesan pada video ${req.file.filename}`, 'completed', 'Berhasil', `PSNR: ${result.metrics.psnr} dB`]
        );
      }
      
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process engine output' });
    }
  });
});
```

#### 4. Mengambil Activity Logs Milik User (`GET /api/activity-logs`):
```javascript
app.get('/api/activity-logs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20',
      [userId]
    );
    
    const logs = rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      type: row.type,
      title: row.title,
      description: row.description,
      status: row.status,
      badgeText: row.badge_text,
      metricSummary: row.metric_summary
    }));
    
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

---

### C. Perbaikan Logika Ekstraksi pada `engine/extract.py`
Ubah baris parsing bit pada `engine/extract.py`:

```python
    # ... (loop pembacaan frame)
    if mean_diff > threshold:
        flat_frame = frame.flatten()
        for i in range(len(flat_frame)):
            extracted_bits += str(flat_frame[i] & 1)
            
            # 1. Baca 32-bit pertama untuk mengetahui panjang karakter string
            if payload_length is None and len(extracted_bits) >= 32:
                payload_length = int(extracted_bits[:32], 2)
                
            # 2. Kalikan dengan 8 karena 1 karakter = 8 bit!
            if payload_length is not None:
                total_payload_bits = payload_length * 8
                if len(extracted_bits) >= 32 + total_payload_bits:
                    break
    
    if payload_length is not None:
        total_payload_bits = payload_length * 8
        if len(extracted_bits) >= 32 + total_payload_bits:
            break
            
    prev_frame = frame

cap.release()

if payload_length is None or payload_length == 0:
    print(json.dumps({"error": "Gagal menemukan header payload atau tidak ada data tersembunyi."}))
    sys.exit(1)

# Potong bit payload secara tepat (panjang karakter * 8 bit)
total_payload_bits = payload_length * 8
payload_binary = extracted_bits[32:32 + total_payload_bits]
extracted_text = binary_to_string(payload_binary)
```

---

Dengan menerapkan perubahan di atas:
1. Proyek steganografi akan terisolasi dengan aman per akun pengguna.
2. Proses ekstraksi data akan berfungsi 100% akurat tanpa menghasilkan teks kosong.
3. Server Express akan terhindar dari potensi crash akibat direktori yang belum tersedia.
