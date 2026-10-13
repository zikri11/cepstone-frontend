/**
 * StegoAnim 2D — API Client Service
 * Interacts with Backend at http://localhost:5000/api
 */

import { ActivityLog, FrameMetric, StegoProject } from "@/types/stego";
import { initialActivities, initialProjects, mockFrameMetrics, overviewStats } from "@/lib/stego-mock-data";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "stego_auth_token";
const USER_KEY = "stego_auth_user";

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  getUser: () => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user: { id: string; username: string; email: string }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
};

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Do not set Content-Type if body is FormData (browser will set boundary automatically)
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
}

export const api = {
  // --- AUTH ---
  auth: {
    register: async (username: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registrasi gagal");
      if (data.token) {
        authStorage.setToken(data.token);
        authStorage.setUser(data.user);
      }
      return data;
    },

    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");
      if (data.token) {
        authStorage.setToken(data.token);
        authStorage.setUser(data.user);
      }
      return data;
    },

    me: async () => {
      const res = await fetchWithAuth("/auth/me");
      if (!res.ok) throw new Error("Gagal mengambil data profil");
      return res.json();
    },

    logout: () => {
      authStorage.clear();
    }
  },

  // --- PROJECTS ---
  projects: {
    getAll: async (params?: { status?: string; search?: string; sortBy?: string }): Promise<StegoProject[]> => {
      try {
        const query = new URLSearchParams();
        if (params?.status && params.status !== "all") query.set("status", params.status);
        if (params?.search) query.set("search", params.search);
        if (params?.sortBy) query.set("sortBy", params.sortBy);

        const res = await fetchWithAuth(`/projects?${query.toString()}`);
        if (!res.ok) throw new Error("Gagal mengambil daftar proyek");
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : initialProjects;
      } catch (err) {
        console.warn("[API Projects Fallback]: Using local dataset", err);
        return initialProjects;
      }
    },

    getById: async (id: string): Promise<StegoProject | null> => {
      try {
        const res = await fetchWithAuth(`/projects/${id}`);
        if (!res.ok) throw new Error("Proyek tidak ditemukan");
        return res.json();
      } catch (err) {
        return initialProjects.find(p => p.id === id) || null;
      }
    },

    delete: async (id: string) => {
      const res = await fetchWithAuth(`/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus proyek");
      return data;
    },

    getFrames: async (projectId: string): Promise<FrameMetric[]> => {
      try {
        const res = await fetchWithAuth(`/projects/${projectId}/frames`);
        if (!res.ok) throw new Error("Gagal mengambil data frame");
        return res.json();
      } catch (err) {
        return mockFrameMetrics;
      }
    },

    getExportUrl: (projectId: string, format: "json" | "csv" = "json") => {
      return `${API_BASE_URL}/projects/${projectId}/export?format=${format}`;
    }
  },

  // --- STEGANOGRAPHY ENGINE ---
  stego: {
    embed: async (params: {
      videoFile: File;
      payload: string;
      threshold?: number;
      bitPlane?: 1 | 2;
      secretKey?: string;
      title?: string;
    }): Promise<StegoProject> => {
      const formData = new FormData();
      formData.append("video", params.videoFile);
      formData.append("payload", params.payload);
      formData.append("threshold", String(params.threshold ?? 12));
      formData.append("bitPlane", String(params.bitPlane ?? 1));
      if (params.secretKey) formData.append("secretKey", params.secretKey);
      if (params.title) formData.append("title", params.title);

      const res = await fetchWithAuth("/stego/embed", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Proses penyisipan steganografi gagal");
      return data;
    },

    extract: async (params: {
      videoFile?: File | null;
      projectId?: string;
      threshold?: number;
      bitPlane?: 1 | 2;
      secretKey?: string;
    }) => {
      const formData = new FormData();
      if (params.videoFile) formData.append("video", params.videoFile);
      if (params.projectId) formData.append("projectId", params.projectId);
      formData.append("threshold", String(params.threshold ?? 12));
      formData.append("bitPlane", String(params.bitPlane ?? 1));
      if (params.secretKey) formData.append("secretKey", params.secretKey);

      const res = await fetchWithAuth("/stego/extract", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Proses ekstraksi steganografi gagal");
      return data;
    },

    verify: async (params: {
      projectId?: string;
      originalHash?: string;
      extractedHash?: string;
    }) => {
      const res = await fetchWithAuth("/stego/verify", {
        method: "POST",
        body: JSON.stringify(params)
      });
      return res.json();
    }
  },

  // --- OVERVIEW & ANALYTICS ---
  stats: {
    get: async () => {
      try {
        const res = await fetchWithAuth("/overview/stats");
        if (!res.ok) throw new Error("Gagal mengambil data statistik");
        return res.json();
      } catch (err) {
        return overviewStats;
      }
    }
  },

  // --- ACTIVITY LOGS ---
  activityLogs: {
    getAll: async (params?: { limit?: number; type?: string }): Promise<ActivityLog[]> => {
      try {
        const query = new URLSearchParams();
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.type && params.type !== "all") query.set("type", params.type);

        const res = await fetchWithAuth(`/activity-logs?${query.toString()}`);
        if (!res.ok) throw new Error("Gagal mengambil activity logs");
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : initialActivities;
      } catch (err) {
        return initialActivities;
      }
    },

    create: async (log: Omit<ActivityLog, "id" | "timestamp">) => {
      const res = await fetchWithAuth("/activity-logs", {
        method: "POST",
        body: JSON.stringify(log)
      });
      return res.json();
    },

    clear: async () => {
      const res = await fetchWithAuth("/activity-logs", { method: "DELETE" });
      return res.json();
    }
  },

  // --- SEED SAMPLE DATA ---
  seed: async () => {
    const res = await fetchWithAuth("/seed", { method: "POST" });
    return res.json();
  }
};
