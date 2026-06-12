// Generates registry.json (for `shadcn build` → public/r/*.json)
// and public/llms.txt from src/lib/components-meta.json.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const meta = JSON.parse(
  readFileSync(resolve(root, "src/lib/components-meta.json"), "utf8")
);

const HOMEPAGE = process.env.REGISTRY_HOMEPAGE ?? "https://velora.dev";

// ---------------------------------------------------------------------------
// Shared CSS fragments. Components copied into a foreign project need their
// keyframes and brand tokens to travel with them.
// ---------------------------------------------------------------------------

const brandVars = {
  light: {
    brand: "oklch(0.541 0.247 287)",
    "brand-from": "oklch(0.541 0.247 287)",
    "brand-via": "oklch(0.667 0.295 322)",
    "brand-to": "oklch(0.715 0.143 215)",
  },
  dark: {
    brand: "oklch(0.673 0.226 287)",
    "brand-from": "oklch(0.673 0.226 287)",
    "brand-via": "oklch(0.74 0.24 322)",
    "brand-to": "oklch(0.789 0.122 215)",
  },
  theme: {
    "color-brand": "var(--brand)",
    "color-brand-from": "var(--brand-from)",
    "color-brand-via": "var(--brand-via)",
    "color-brand-to": "var(--brand-to)",
  },
};

const keyframes = {
  marquee: {
    "@keyframes marquee": {
      from: { transform: "translateX(0)" },
      to: { transform: "translateX(calc(-100% - var(--gap)))" },
    },
    "@keyframes marquee-vertical": {
      from: { transform: "translateY(0)" },
      to: { transform: "translateY(calc(-100% - var(--gap)))" },
    },
  },
  shimmer: {
    "@keyframes shimmer": {
      from: { "background-position": "200% 0" },
      to: { "background-position": "-200% 0" },
    },
  },
  gradient: {
    "@keyframes gradient": {
      "0%, 100%": { "background-position": "0% 50%" },
      "50%": { "background-position": "100% 50%" },
    },
  },
  orbit: {
    "@keyframes orbit": {
      "0%": {
        transform:
          "rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * -1px)) rotate(calc(var(--angle) * -1deg))",
      },
      "100%": {
        transform:
          "rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * -1px)) rotate(calc((var(--angle) * 1deg + 360deg) * -1))",
      },
    },
  },
  aurora: {
    "@keyframes aurora-1": {
      "0%": { transform: "translate(-10%, -12%) scale(1)" },
      "50%": { transform: "translate(12%, 8%) scale(1.25)" },
      "100%": { transform: "translate(-6%, 14%) scale(0.95)" },
    },
    "@keyframes aurora-2": {
      "0%": { transform: "translate(12%, 10%) scale(1.1)" },
      "50%": { transform: "translate(-14%, -6%) scale(0.9)" },
      "100%": { transform: "translate(8%, -12%) scale(1.2)" },
    },
    "@keyframes aurora-3": {
      "0%": { transform: "translate(0%, 16%) scale(0.95)" },
      "50%": { transform: "translate(10%, -10%) scale(1.15)" },
      "100%": { transform: "translate(-12%, 4%) scale(1)" },
    },
  },
  meteor: {
    "@keyframes meteor": {
      "0%": {
        transform: "rotate(var(--meteor-angle, 215deg)) translateX(0)",
        opacity: "1",
      },
      "70%": { opacity: "1" },
      "100%": {
        transform: "rotate(var(--meteor-angle, 215deg)) translateX(-600px)",
        opacity: "0",
      },
    },
  },
  retroGrid: {
    "@keyframes retro-grid": {
      from: { transform: "translateY(-50%)" },
      to: { transform: "translateY(0)" },
    },
  },
};

// Per-slug extras: { css, cssVars } merged into the registry item.
const extras = {
  marquee: {
    css: keyframes.marquee,
    cssVars: {
      theme: {
        "animate-marquee": "marquee var(--duration, 40s) linear infinite",
        "animate-marquee-vertical":
          "marquee-vertical var(--duration, 40s) linear infinite",
      },
    },
  },
  "shimmer-button": {
    css: keyframes.shimmer,
    cssVars: { theme: { "animate-shimmer": "shimmer 2.5s linear infinite" } },
  },
  "text-shimmer": {
    css: keyframes.shimmer,
    cssVars: { theme: { "animate-shimmer": "shimmer 2.5s linear infinite" } },
  },
  "animated-gradient-text": {
    css: keyframes.gradient,
    cssVars: {
      ...brandVars,
      theme: {
        ...brandVars.theme,
        "animate-gradient": "gradient 6s ease infinite",
      },
    },
  },
  "orbiting-circles": {
    css: keyframes.orbit,
    cssVars: {
      theme: { "animate-orbit": "orbit calc(var(--duration) * 1s) linear infinite" },
    },
  },
  "aurora-background": {
    css: keyframes.aurora,
    cssVars: {
      ...brandVars,
      theme: {
        ...brandVars.theme,
        "animate-aurora-1": "aurora-1 14s ease-in-out infinite alternate",
        "animate-aurora-2": "aurora-2 18s ease-in-out infinite alternate",
        "animate-aurora-3": "aurora-3 22s ease-in-out infinite alternate",
      },
    },
  },
  meteors: {
    css: keyframes.meteor,
    cssVars: { theme: { "animate-meteor": "meteor 5s linear infinite" } },
  },
  "retro-grid": {
    css: keyframes.retroGrid,
    cssVars: {
      theme: { "animate-retro-grid": "retro-grid 18s linear infinite" },
    },
  },
  "border-beam": { cssVars: brandVars },
  "scroll-progress": { cssVars: brandVars },
  "background-beams": { cssVars: brandVars },
  "sparkles-text": { cssVars: brandVars },
  lamp: { cssVars: brandVars },
  "spotlight-card": { cssVars: brandVars },
};

const items = meta.map((c) => ({
  name: c.slug,
  type: "registry:ui",
  title: c.title,
  description: c.description,
  dependencies: c.dependencies.length ? c.dependencies : undefined,
  files: [
    {
      path: `src/components/velora/${c.slug}.tsx`,
      type: "registry:ui",
      target: `components/velora/${c.slug}.tsx`,
    },
  ],
  ...(extras[c.slug] ?? {}),
}));

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "velora",
  homepage: HOMEPAGE,
  items,
};

writeFileSync(
  resolve(root, "registry.json"),
  JSON.stringify(registry, null, 2) + "\n"
);

// ---------------------------------------------------------------------------
// llms.txt — lets AI agents discover and install Velora components.
// ---------------------------------------------------------------------------

const llms = `# Velora UI

> Free, MIT-licensed animated React components and landing page templates.
> Built with Next.js, Tailwind CSS 4, shadcn/ui and Motion.

Install any component with the shadcn CLI:

    npx shadcn@latest add ${HOMEPAGE}/r/<name>.json

## Components

${meta
  .map(
    (c) => `- [${c.title}](${HOMEPAGE}/components/${c.slug}): ${c.description} Install: \`npx shadcn@latest add ${HOMEPAGE}/r/${c.slug}.json\``
  )
  .join("\n")}
`;

writeFileSync(resolve(root, "public/llms.txt"), llms);

console.log(`registry.json: ${items.length} items, llms.txt written`);
