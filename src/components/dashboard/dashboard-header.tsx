"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BarChart3Icon,
  ChevronRightIcon,
  FileVideoIcon,
  KeyRoundIcon,
  LayersIcon,
  LayoutDashboardIcon,
  PlusIcon,
  ShieldCheckIcon,
  UploadCloudIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export type DashboardTabId =
  | "overview"
  | "embed"
  | "extract"
  | "telemetry"
  | "history";

interface TabItem {
  id: DashboardTabId;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DASHBOARD_TABS: TabItem[] = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboardIcon },
  { id: "embed", label: "Penyisipan (Embed)", icon: UploadCloudIcon },
  { id: "extract", label: "Ekstraksi (Extract)", icon: KeyRoundIcon },
  { id: "telemetry", label: "Analisis Komparasi", icon: BarChart3Icon },
  { id: "history", label: "Riwayat Video", badge: "24", icon: LayersIcon },
];

interface DashboardHeaderProps {
  activeTab: DashboardTabId;
  onTabChange: (tab: DashboardTabId) => void;
}

export function DashboardHeader({
  activeTab,
  onTabChange,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      {/* Top Navbar Row */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Breadcrumbs & Engine Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 text-foreground font-semibold text-sm transition-opacity hover:opacity-80"
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <FileVideoIcon className="size-4" />
            </div>
            <span className="tracking-tight hidden sm:inline">StegoAnim 2D</span>
          </Link>

          <ChevronRightIcon className="size-3.5 text-muted-foreground/40 shrink-0" />

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Workspace
            </span>
            <ChevronRightIcon className="size-3 text-muted-foreground/40 shrink-0" />
            <span className="font-medium text-foreground">Dashboard</span>
          </div>

        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick CTA */}
          <button
            type="button"
            onClick={() => onTabChange("embed")}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-colors cursor-pointer"
          >
            <PlusIcon className="size-3.5" />
            <span>Proses Video Baru</span>
          </button>

          {/* Security Badge */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-muted-foreground/80 px-2 py-1 rounded-md border border-border/50 bg-muted/20">
            <ShieldCheckIcon className="size-3.5 text-primary" />
            <span>AES-256 Enabled</span>
          </div>

          <ThemeToggle />

          {/* User Avatar Placeholder */}
          <div className="flex size-8 items-center justify-center rounded-full bg-muted/60 border border-border/70 text-xs font-medium text-foreground">
            Z
          </div>
        </div>
      </div>

      {/* Vercel-Style Sticky Tab Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar pt-1"
          aria-label="Dashboard Tabs"
        >
          {DASHBOARD_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors cursor-pointer shrink-0 select-none",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground/70"
                  )}
                />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={cn(
                      "ms-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-semibold transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}

                {/* Animated Vercel active underline */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
