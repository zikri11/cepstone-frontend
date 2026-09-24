"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  EyeIcon,
  FileVideoIcon,
  KeyRoundIcon,
  LayersIcon,
} from "lucide-react";

import {
  DashboardHeader,
  DashboardTabId,
} from "@/components/dashboard/dashboard-header";
import {
  initialActivities,
  initialProjects,
} from "@/lib/stego-mock-data";
import { ActivityLog, StegoProject } from "@/types/stego";
import { Badge } from "@/components/ui/badge";
import { OverviewTab } from "@/components/dashboard/tabs/overview-tab";
import { EmbedTab } from "@/components/dashboard/tabs/embed-tab";
import { ExtractTab } from "@/components/dashboard/tabs/extract-tab";
import { TelemetryTab } from "@/components/dashboard/tabs/telemetry-tab";
import { HistoryTab } from "@/components/dashboard/tabs/history-tab";

export function DashboardView() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const [projects, setProjects] = useState<StegoProject[]>(initialProjects);
  const [activities, setActivities] =
    useState<ActivityLog[]>(initialActivities);

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
      <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

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
              <TelemetryTab />
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
