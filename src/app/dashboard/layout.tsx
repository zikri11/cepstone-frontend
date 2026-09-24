import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Workspace - StegoAnim 2D",
  description:
    "Workspace pengujian steganografi video animasi 2D berbasis inter-frame difference untuk komunikasi data aman.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {children}
    </div>
  );
}
