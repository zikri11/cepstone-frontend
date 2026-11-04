"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

import {
  DashboardHeader,
  DashboardTabId,
} from "@/components/dashboard/dashboard-header";
import { ActivityLog, StegoProject } from "@/types/stego";
import { fetchProjects, fetchActivityLogs, getAuthToken } from "@/lib/api";
import { OverviewTab } from "@/components/dashboard/tabs/overview-tab";
import { EmbedTab } from "@/components/dashboard/tabs/embed-tab";
import { ExtractTab } from "@/components/dashboard/tabs/extract-tab";
import { TelemetryTab } from "@/components/dashboard/tabs/telemetry-tab";
import { HistoryTab } from "@/components/dashboard/tabs/history-tab";

export function DashboardView() {
  const router = useRouter();
  const [isAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(getAuthToken());
    }
    return true;
  });
  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const [projects, setProjects] = useState<StegoProject[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    Promise.all([
      fetchProjects(),
      fetchActivityLogs()
    ])
      .then(([liveProjects, liveLogs]) => {
        setProjects(liveProjects);
        setActivities(liveLogs);
      })
      .catch(() => {});
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground font-mono">Memverifikasi sesi pengguna...</p>
        </div>
      </div>
    );
  }

  const handleSuccessEmbed = (newProject: StegoProject) => {
    setProjects((prev) => {
      if (prev.some((p) => p.id === newProject.id)) return prev;
      return [newProject, ...prev];
    });

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: "Baru saja",
      type: "embed",
      title: "Penyisipan Selesai",
      description: `${newProject.filename} disisipkan ${newProject.metrics.payloadSizeBytes} B data rahasia.`,
      status: "completed",
      badgeText: "Stego Video Siap",
      metricSummary: `PSNR: ${newProject.metrics.psnr} dB • SSIM: ${newProject.metrics.ssim}`,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleSuccessExtract = (extractedProject: StegoProject) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === extractedProject.id ? { ...p, status: "extracted" as const } : p
      )
    );

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: "Baru saja",
      type: "extract",
      title: "Ekstraksi Selesai",
      description: `${extractedProject.filename} berhasil diekstrak dan dicocokkan (SHA-256 Valid).`,
      status: "completed",
      badgeText: "SHA-256 Valid",
      metricSummary: "Integritas 100% Cocok",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        projectsCount={projects.length}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <OverviewTab
                onNavigateTab={setActiveTab}
                activities={activities}
                projects={projects}
              />
            </motion.div>
          )}

          {activeTab === "embed" && (
            <motion.div
              key="embed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <EmbedTab
                onSuccessEmbed={handleSuccessEmbed}
                onNavigateTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === "extract" && (
            <motion.div
              key="extract"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ExtractTab
                projects={projects}
                onNavigateTab={setActiveTab}
                onSuccessExtract={handleSuccessExtract}
              />
            </motion.div>
          )}

          {activeTab === "telemetry" && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <TelemetryTab
                projects={projects}
                onNavigateTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HistoryTab
                projects={projects}
                onDeleteProject={handleDeleteProject}
                onNavigateTab={setActiveTab}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
