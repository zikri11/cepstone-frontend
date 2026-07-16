# Velora UI

**Free, MIT-licensed animated components and complete landing templates for React.**

32+ animated shadcn/ui components and a full multi-page SaaS template — home, pricing, blog (MDX), auth, changelog, contact and 404 — built with Next.js 16, Tailwind CSS 4 and Motion. The free tier isn't a teaser: everything on the site ships under MIT, commercial use included.

## Why Velora

- **The free tier is the whole product.** Complete assembled pages, not just isolated components. The kind of template that costs $149–$299 elsewhere is the baseline here.
- **Animations with receipts.** Every component's docs page shows its gzipped size (0.6–1.5 KB — no Three.js payloads) and dependency count. 15 of 32 components have zero runtime dependencies; the rest use Motion and nothing else.
- **Tokens, not hardcoded hues.** Components read your shadcn CSS variables. Rebrand every gradient, beam and glow by editing seven variables — ready-made presets on the [themes page](https://velora.dev/themes).
- **Motion that asks permission.** A global `prefers-reduced-motion` kill switch covers every animation. Keyboard focus stays visible, markup stays semantic.
- **Primitive-agnostic.** Velora components import neither Radix nor Base UI — they work in any shadcn project, whichever primitive layer you use.

## Install components

Every component is a standard shadcn registry item:

```bash
npx shadcn@latest add https://velora.dev/r/aurora-background.json
```

Components carry their own keyframes and brand tokens, so they work standalone in existing projects. Browse the full catalog at [velora.dev/components](https://velora.dev/components).

### Use with AI agents

Velora is a standard shadcn registry, so it plugs into the shadcn MCP server with zero extra setup — an agent in Cursor, Claude Code or VS Code can browse and install Velora components by name:

```bash
pnpm dlx shadcn@latest mcp init --client claude
```

For discovery, [llms.txt](https://velora.dev/llms.txt) lists every component with its install command, gzipped size and dependency count — so an agent can pick components by cost, not just by looks.

## Use the template

```bash
git clone <repo-url> my-landing
cd my-landing
pnpm install
pnpm dev
```

Then make it yours:

1. **Content** — pages live in `src/app/`, section data is inline per page.
2. **Brand** — swap the token block in `src/app/globals.css` (or copy a preset from `/themes`).
3. **Blog** — add MDX files under `src/app/blog/(posts)/<slug>/page.mdx` and register them in `src/lib/blog-posts.ts`.
4. **Forms** — contact and auth forms are frontend-only demos; wire them to your backend or auth provider.

## Scripts

```bash
pnpm dev              # dev server (Turbopack)
pnpm build            # production build (all pages static)
pnpm lint             # eslint
pnpm registry:build   # component stats + registry.json + public/r/*.json + llms.txt
```

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui · Motion · TypeScript

## License

[MIT](./LICENSE) — free for personal and commercial use, no attribution required.
