-- 1. Tabel Utama: Projects
CREATE TABLE projects (
    id VARCHAR(36) PRIMARY KEY, -- Menggunakan UUID string (36 karakter)
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_size VARCHAR(50) NOT NULL, -- Contoh: "15.4 MB"
    resolution VARCHAR(50) NOT NULL, -- Contoh: "1920x1080"
    fps DECIMAL(5,2) NOT NULL,
    duration VARCHAR(50) NOT NULL, -- Contoh: "00:03:45"
    total_frames INT NOT NULL,
    status ENUM('embedded', 'extracted', 'processing', 'ready') NOT NULL DEFAULT 'ready',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thumbnail_color VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Tabel 1-to-1: Metrics (Evaluasi Steganografi)
CREATE TABLE metrics (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL UNIQUE,
    psnr DECIMAL(10,4) NOT NULL,
    ssim DECIMAL(5,4) NOT NULL,
    mse DECIMAL(10,4) NOT NULL,
    payload_capacity_bpp DECIMAL(10,4) NOT NULL,
    payload_size_bytes INT NOT NULL,
    integrity_valid BOOLEAN NOT NULL,
    sha256_original VARCHAR(64) NOT NULL,
    sha256_extracted VARCHAR(64) NOT NULL,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 3. Tabel 1-to-1: Payloads (Data/Pesan yang disisipkan)
CREATE TABLE payloads (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL UNIQUE,
    type ENUM('text', 'file') NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    size_bytes INT NOT NULL,
    content LONGTEXT NOT NULL, -- LONGTEXT karena bisa berisi Base64 string yang sangat panjang
    secret_key VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 4. Tabel 1-to-Many: Frame Metrics (Data deteksi pergerakan per frame)
CREATE TABLE frame_metrics (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    frame_number INT NOT NULL,
    timestamp VARCHAR(20) NOT NULL,
    motion_delta DECIMAL(10,4) NOT NULL,
    is_dynamic_region BOOLEAN NOT NULL,
    psnr DECIMAL(10,4) NOT NULL,
    ssim DECIMAL(5,4) NOT NULL,
    mse DECIMAL(10,4) NOT NULL,
    embedded_bits INT NOT NULL,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 5. Tabel Independen: Activity Logs (Riwayat Audit / Logs)
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('embed', 'extract', 'verify', 'export') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('completed', 'in_progress', 'failed') NOT NULL,
    badge_text VARCHAR(50) NOT NULL,
    metric_summary VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Tabel Auth: Users (Registrasi dan Login)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
