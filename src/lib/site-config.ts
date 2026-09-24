/**
 * Single source of truth for external URLs. Override at build time with
 * NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_GITHUB_URL when the real domain and
 * repo are wired up.
 */
export const siteConfig = {
  name: "StegoAnim 2D",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, ""),
  github:
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/ColorlibHQ/velora-ui",
  tagline: "Steganografi Video Animasi 2D Berbasis Inter-Frame Difference",
  description:
    "Aplikasi web penerapan steganografi video animasi 2D berbasis inter-frame difference dan LSB untuk komunikasi data aman.",
} as const;
