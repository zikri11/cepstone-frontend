import { StegoProject, UserProfile, ActivityLog, FrameMetric, ExtractionApiResponse } from "@/types/stego";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("stego_token");
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("stego_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("stego_token", token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("stego_token");
    localStorage.removeItem("stego_user");
  }
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Login gagal");
  }
  if (data.token) {
    setAuthToken(data.token);
    if (data.user && typeof window !== "undefined") {
      localStorage.setItem("stego_user", JSON.stringify(data.user));
    }
  }
  return data;
}

export async function registerUser(username: string, email: string, password: string, adminSecret?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, adminSecret }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Registrasi gagal");
  }
  return data;
}

export async function verifyEmailApi(email: string, code: string) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Verifikasi gagal");
  }
  if (data.token) {
    setAuthToken(data.token);
    if (data.user && typeof window !== "undefined") {
      localStorage.setItem("stego_user", JSON.stringify(data.user));
    }
  }
  return data;
}

export async function resendCodeApi(email: string, type: "verify" | "reset" = "verify") {
  const res = await fetch(`${API_BASE_URL}/auth/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, type }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mengirim ulang kode");
  }
  return data;
}

export async function forgotPasswordApi(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal memproses lupa kata sandi");
  }
  return data;
}

export async function verifyResetCodeApi(email: string, code: string) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Kode verifikasi tidak cocok atau kedaluwarsa");
  }
  return data;
}

export async function resetPasswordApi(params: { email?: string; code?: string; token?: string; newPassword: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mereset kata sandi");
  }
  return data;
}

export async function fetchProjects(): Promise<StegoProject[]> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/projects`, { headers });
  if (!res.ok) {
    throw new Error("Gagal mengambil data proyek");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.projects || [];
}

export async function embedVideoApi(formData: FormData): Promise<StegoProject> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/stego/embed`, {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Gagal menyisipkan pesan");
  }
  return data;
}

export async function extractVideoApi(formData: FormData): Promise<ExtractionApiResponse> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/stego/extract`, {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || "Gagal mengekstrak pesan");
  }
  return data;
}

export async function fetchActivityLogs(): Promise<ActivityLog[]> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/activity-logs`, { headers });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchProjectFrames(projectId: string): Promise<FrameMetric[]> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/frames`, { headers });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
