import Link from "next/link";
import { SparklesIcon } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

const groups = [
  {
    title: "Navigasi",
    links: [
      { text: "Beranda", href: "/" },
      { text: "Alur Kerja", href: "#workflow" },
      { text: "Metode & Fitur", href: "#features" },
      { text: "Hasil Riset", href: "#evaluation" },
    ],
  },
  {
    title: "Modul Inti",
    links: [
      { text: "Proses Embedding", href: "#process" },
      { text: "Proses Extraction", href: "#process" },
      { text: "Analisis Inter-Frame", href: "#workflow" },
      { text: "Evaluasi PSNR", href: "#evaluation" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { text: "Latar Belakang", href: "#about" },
      { text: "FAQ Riset", href: "#faq" },
      { text: "Repositori Proyek", href: siteConfig.github },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-semibold tracking-tight text-foreground">
            StegoAnim 2D
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Penerapan Steganografi Video Animasi 2D Berbasis Inter-Frame Difference
            untuk Komunikasi Data Aman.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Tugas Capstone Projek Teknik Informatika 2026
          </p>
        </div>
        {groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="text-sm font-semibold">{group.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {group.links.map((link) => (
                <li key={link.text}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      rel="noopener"
                      className="transition-colors hover:text-foreground"
                    >
                      {link.text}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {link.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-border/40 px-4 pt-6 text-xs text-muted-foreground md:flex-row lg:px-8">
        <span>StegoAnim 2D — Sistem Komunikasi Data Aman Berbasis Steganografi.</span>
        <span>Inter-Frame Difference &amp; Least Significant Bit (LSB).</span>
      </div>
    </footer>
  );
}
