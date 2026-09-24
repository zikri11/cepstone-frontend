import type { Metadata } from "next";

import { AuthForm } from "@/components/template/auth-form";
import { AuthVisual } from "@/components/template/auth-visual";
import { BlurFade } from "@/components/velora/blur-fade";

export const metadata: Metadata = {
  title: "Masuk Akun — StegoAnim 2D",
  description:
    "Masuk ke akun pengguna untuk sistem steganografi video animasi 2D berbasis inter-frame difference dan LSB.",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-svh lg:h-screen lg:overflow-hidden lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center px-6 py-8 sm:px-12">
        <BlurFade delay={0.05} className="w-full max-w-[360px]">
          <AuthForm mode="login" />
        </BlurFade>
      </div>
      <AuthVisual />
    </main>
  );
}
