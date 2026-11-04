const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 payload
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper function to map snake_case from DB to camelCase for Frontend
const mapProjectToCamelCase = (row) => {
  return {
    id: row.id,
    title: row.title,
    filename: row.filename,
    fileSize: row.file_size,
    resolution: row.resolution,
    fps: row.fps,
    duration: row.duration,
    totalFrames: row.total_frames,
    status: row.status,
    createdAt: row.created_at,
    thumbnailColor: row.thumbnail_color,
  };
};

const mapMetricsToCamelCase = (row) => {
  if (!row) return null;
  return {
    psnr: row.psnr,
    ssim: row.ssim,
    mse: row.mse,
    payloadCapacityBpp: row.payload_capacity_bpp,
    payloadSizeBytes: row.payload_size_bytes,
    integrityValid: Boolean(row.integrity_valid),
    sha256Original: row.sha256_original,
    sha256Extracted: row.sha256_extracted,
  };
};

const mapPayloadToCamelCase = (row) => {
  if (!row) return null;
  return {
    type: row.type,
    name: row.name,
    sizeBytes: row.size_bytes,
    content: row.content,
    secretKey: row.secret_key,
  };
};

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    const projects = rows.map(mapProjectToCamelCase);
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET specific project with all its details (metrics, payload)
app.get('/api/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    const [projectRows] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    if (projectRows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
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

// GET frame metrics for a project
app.get('/api/projects/:id/frames', async (req, res) => {
  try {
    const projectId = req.params.id;
    const [rows] = await db.query('SELECT * FROM frame_metrics WHERE project_id = ? ORDER BY frame_number ASC', [projectId]);
    
    const frames = rows.map(row => ({
      frameNumber: row.frame_number,
      timestamp: row.timestamp,
      motionDelta: row.motion_delta,
      isDynamicRegion: Boolean(row.is_dynamic_region),
      psnr: row.psnr,
      ssim: row.ssim,
      mse: row.mse,
      embeddedBits: row.embedded_bits
    }));
    
    res.json(frames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET activity logs
app.get('/api/activity-logs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 20');
    
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

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const [existing] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email atau username sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    await db.query('INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)', [id, username, email, hashedPassword]);
    
    res.status(201).json({ message: 'Registrasi berhasil', userId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email }, 
      process.env.JWT_SECRET || 'rahasia-super-aman', 
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login berhasil', token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
