"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  BarChart3Icon,
  ChevronRightIcon,
  KeyRoundIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  ShieldCheckIcon,
  UploadCloudIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser, removeAuthToken } from "@/lib/api";
import { UserProfile } from "@/types/stego";

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
  { id: "history", label: "Riwayat Video", icon: LayersIcon },
];

interface DashboardHeaderProps {
  activeTab: DashboardTabId;
  onTabChange: (tab: DashboardTabId) => void;
  projectsCount?: number;
}

export function DashboardHeader({
  activeTab,
  onTabChange,
  projectsCount,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [currentUser] = useState<UserProfile | null>(() => getCurrentUser());

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const userInitial = currentUser?.username?.[0]?.toUpperCase() || "U";
  const roleName = currentUser?.role === "admin" ? "Admin" : "User";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      {/* Top Navbar Row */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Breadcrumbs & Engine Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-foreground font-semibold text-sm transition-opacity hover:opacity-80"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <img
                src="/logo-unsil.png"
                alt="Logo Universitas Siliwangi"
                className="h-6 w-auto object-contain"
              />
              <img
                src="/logo-if.png"
                alt="Logo Informatika UNSIL"
                className="h-5 w-auto object-contain rounded-xs"
              />
            </div>
            <span className="tracking-tight hidden sm:inline font-bold">StegoAnim 2D</span>
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
        <div className="flex items-center gap-2.5">
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

          {/* User Profile & Role Info */}
          <div className="flex items-center gap-2 ps-1">
            <div
              title={`${currentUser?.username || "Pengguna"} (${roleName})`}
              className="flex size-8 items-center justify-center rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary"
            >
              {userInitial}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                {currentUser?.username || "Pengguna"}
              </span>
              <span className={`text-[10px] font-mono leading-none ${currentUser?.role === "admin" ? "text-amber-500 font-bold" : "text-muted-foreground"}`}>
                {roleName}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Keluar (Logout)"
              className="size-8 rounded-lg border border-border/60 hover:bg-muted/40 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors cursor-pointer ms-1"
            >
              <LogOutIcon className="size-3.5" />
            </button>
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
            const badge = tab.id === "history" && projectsCount !== undefined ? String(projectsCount) : tab.badge;

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

                {badge && (
                  <span
                    className={cn(
                      "ms-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-semibold transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {badge}
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
