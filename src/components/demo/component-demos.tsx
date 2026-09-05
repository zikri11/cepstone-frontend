import {
  GaugeIcon,
  LayersIcon,
  MoonIcon,
  PaletteIcon,
  RocketIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";

import { IntegrationsBeam } from "@/components/demo/integrations-beam";
import { ThemeTogglerDemo } from "@/components/demo/theme-toggler-demo";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { AnimatedList } from "@/components/velora/animated-list";
import { AnimatedTooltip } from "@/components/velora/animated-tooltip";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { AvatarCircles } from "@/components/velora/avatar-circles";
import { BackgroundBeams } from "@/components/velora/background-beams";
import { BentoCard, BentoGrid } from "@/components/velora/bento-grid";
import { BlurFade } from "@/components/velora/blur-fade";
import { BorderBeam } from "@/components/velora/border-beam";
import { BrowserMockup } from "@/components/velora/browser-mockup";
import { ConfettiButton } from "@/components/velora/confetti";
import { Dock, DockIcon } from "@/components/velora/dock";
import { FlipWords } from "@/components/velora/flip-words";
import { DotPattern, GridPattern } from "@/components/velora/grid-pattern";
import { IphoneMockup } from "@/components/velora/iphone-mockup";
import { Lamp } from "@/components/velora/lamp";
import { Marquee } from "@/components/velora/marquee";
import { Meteors } from "@/components/velora/meteors";
import { NumberTicker } from "@/components/velora/number-ticker";
import { OrbitingCircles } from "@/components/velora/orbiting-circles";
import { Particles } from "@/components/velora/particles";
import { RetroGrid } from "@/components/velora/retro-grid";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { SparklesText } from "@/components/velora/sparkles-text";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { Terminal } from "@/components/velora/terminal";
import { TextReveal } from "@/components/velora/text-reveal";
import { TextShimmer } from "@/components/velora/text-shimmer";
import { TiltCard } from "@/components/velora/tilt-card";
import { Typewriter } from "@/components/velora/typewriter";
import { AnimatedTestimonials } from "@/components/velora/animated-testimonials";
import { CardStack } from "@/components/velora/card-stack";
import { CompareSlider } from "@/components/velora/compare-slider";
import { ContainerScroll } from "@/components/velora/container-scroll";
import { DirectionAwareHover } from "@/components/velora/direction-aware-hover";
import { ExpandableCard } from "@/components/velora/expandable-card";
import { FileDrop } from "@/components/velora/file-drop";
import { FileTree } from "@/components/velora/file-tree";
import { FlickeringGrid } from "@/components/velora/flickering-grid";
import { GlareCard } from "@/components/velora/glare-card";
import { HyperText } from "@/components/velora/hyper-text";
import { LightRays } from "@/components/velora/light-rays";
import { LogoCloud } from "@/components/velora/logo-cloud";
import { MagneticButton } from "@/components/velora/magnetic-button";
import { MorphingText } from "@/components/velora/morphing-text";
import { MovingBorder } from "@/components/velora/moving-border";
import { MenuItem, NavbarMenu } from "@/components/velora/navbar-menu";
import { ParallaxGrid } from "@/components/velora/parallax-grid";
import { RainbowButton } from "@/components/velora/rainbow-button";
import { Ripple } from "@/components/velora/ripple";
import { RippleButton } from "@/components/velora/ripple-button";
import { ScrollVelocity } from "@/components/velora/scroll-velocity";
import { Stepper } from "@/components/velora/stepper";
import { StickyBanner } from "@/components/velora/sticky-banner";
import { TextHighlighter } from "@/components/velora/text-highlighter";
import { TracingBeam } from "@/components/velora/tracing-beam";
import { TweetCard } from "@/components/velora/tweet-card";
import { VanishInput } from "@/components/velora/vanish-input";
import { WordRotate } from "@/components/velora/word-rotate";

const chips = ["Astro", "Next.js", "Remix", "Vite", "Nuxt", "SvelteKit"];

const frame =
  "flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-lg";

const quotes = [
  {
    quote:
      "Swapped three separate animation libraries for Velora and the bundle got smaller.",
    name: "Dana Whitfield",
    role: "Staff engineer, Corvine",
  },
  {
    quote:
      "The size on every docs page is the reason we shipped it without a review meeting.",
    name: "Marco Elias",
    role: "Design engineer, Halyard",
  },
  {
    quote: "Reduced-motion worked out of the box. That never happens.",
    name: "Priya Raman",
    role: "Accessibility lead, Northbeam",
  },
];

export const componentDemos: Record<string, React.ReactNode> = {
  "aurora-background": (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-lg">
      <AuroraBackground intensity="vivid" />
      <p className="relative text-xl font-semibold">Aurora</p>
    </div>
  ),
  "grid-pattern": (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-lg">
      <GridPattern
        width={36}
        height={36}
        className="fill-transparent stroke-border [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
      />
      <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,black,transparent_55%)]" />
      <p className="relative text-xl font-semibold">Patterns</p>
    </div>
  ),
  "retro-grid": (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-lg">
      <RetroGrid opacity={0.6} />
      <p className="relative text-xl font-semibold">Retro Grid</p>
    </div>
  ),
  particles: (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-950 text-white">
      <Particles quantity={80} />
      <p className="relative text-xl font-semibold">Particles</p>
    </div>
  ),
  meteors: (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-950 text-white">
      <Meteors number={12} className="bg-white/70 before:from-white/60" />
      <p className="relative text-xl font-semibold">Meteors</p>
    </div>
  ),
  "background-beams": (
    <div className="relative flex h-full min-h-64 w-full items-center justify-center overflow-hidden rounded-lg">
      <BackgroundBeams />
      <p className="relative text-xl font-semibold">Beams</p>
    </div>
  ),
  lamp: (
    <div className="w-full overflow-hidden rounded-lg [&_[data-slot=lamp]]:py-12">
      <Lamp className="[&>div:first-child]:min-h-44">
        <h3 className="text-2xl font-semibold">Lit from above</h3>
      </Lamp>
    </div>
  ),
  "animated-gradient-text": (
    <p className="text-3xl font-semibold">
      Ship <AnimatedGradientText>beautiful</AnimatedGradientText> pages
    </p>
  ),
  "text-reveal": (
    <TextReveal
      text="Every word arrives exactly when it should"
      className="max-w-sm text-center text-2xl font-semibold"
    />
  ),
  typewriter: (
    <p className="text-2xl font-semibold">
      Build it{" "}
      <AnimatedGradientText>
        <Typewriter words={["faster.", "smoother.", "free."]} />
      </AnimatedGradientText>
    </p>
  ),
  "flip-words": (
    <p className="text-2xl font-semibold">
      Make it <FlipWords words={["modern", "animated", "accessible"]} className="text-primary" />
    </p>
  ),
  "sparkles-text": (
    <SparklesText className="text-3xl font-semibold">Magic moments</SparklesText>
  ),
  "text-shimmer": (
    <TextShimmer className="text-2xl font-semibold">
      Generating your page…
    </TextShimmer>
  ),
  "number-ticker": (
    <p className="text-5xl font-semibold tracking-tight">
      <NumberTicker value={12480} suffix="+" />
    </p>
  ),
  "shimmer-button": (
    <ShimmerButton>
      <RocketIcon className="size-4" />
      Get started
    </ShimmerButton>
  ),
  confetti: <ConfettiButton>🎉 Click me</ConfettiButton>,
  "bento-grid": (
    <BentoGrid className="w-full auto-rows-[11rem] grid-cols-2 gap-3">
      <BentoCard
        name="Patterns"
        description="Maskable backdrops."
        background={
          <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        }
      />
      <BentoCard
        name="Meteors"
        description="Streaks of light."
        background={<Meteors number={6} />}
      />
    </BentoGrid>
  ),
  "spotlight-card": (
    <SpotlightCard className="w-full max-w-sm p-8">
      <h3 className="font-semibold">Move your cursor here</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The glow follows the pointer across the card surface.
      </p>
    </SpotlightCard>
  ),
  "tilt-card": (
    <TiltCard className="w-full max-w-sm">
      <div className="rounded-2xl border bg-card p-8">
        <h3 className="font-semibold">Tilt me</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          3D perspective that tracks your cursor.
        </p>
      </div>
    </TiltCard>
  ),
  marquee: (
    <Marquee pauseOnHover className="w-full [--duration:18s]">
      {chips.map((chip) => (
        <span
          key={chip}
          className="mx-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium"
        >
          {chip}
        </span>
      ))}
    </Marquee>
  ),
  "animated-list": (
    <div className="h-56 w-full max-w-sm overflow-hidden [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
      <AnimatedList delay={1500}>
        {["Deploy succeeded", "New signup", "Payment received", "New review"].map(
          (title) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-xl border bg-card p-3 text-sm shadow-sm"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ZapIcon className="size-4" />
              </span>
              {title}
            </div>
          )
        )}
      </AnimatedList>
    </div>
  ),
  "orbiting-circles": (
    <div className="relative flex h-64 w-full items-center justify-center">
      <SparklesIcon className="size-7 text-primary" />
      <OrbitingCircles radius={80} iconSize={26} duration={18}>
        <LayersIcon className="size-4 text-muted-foreground" />
        <PaletteIcon className="size-4 text-muted-foreground" />
        <GaugeIcon className="size-4 text-muted-foreground" />
        <MoonIcon className="size-4 text-muted-foreground" />
      </OrbitingCircles>
    </div>
  ),
  "avatar-circles": (
    <AvatarCircles
      people={["Maya Chen", "Tom Okafor", "Sofia Lindqvist", "Dan Romero"]}
      extra={2400}
    />
  ),
  "animated-tooltip": (
    <AnimatedTooltip
      items={[
        { name: "Maya Chen", role: "Design engineer" },
        { name: "Tom Okafor", role: "Frontend lead" },
        { name: "Sofia Lindqvist", role: "Indie hacker" },
        { name: "Dan Romero", role: "CTO" },
      ]}
    />
  ),
  dock: (
    <Dock>
      <DockIcon label="Layers">
        <LayersIcon className="size-5" />
      </DockIcon>
      <DockIcon label="Palette">
        <PaletteIcon className="size-5" />
      </DockIcon>
      <DockIcon label="Speed">
        <GaugeIcon className="size-5" />
      </DockIcon>
      <DockIcon label="Energy">
        <ZapIcon className="size-5" />
      </DockIcon>
      <DockIcon label="Launch">
        <RocketIcon className="size-5" />
      </DockIcon>
    </Dock>
  ),
  "border-beam": (
    <div className="relative flex h-40 w-full max-w-sm items-center justify-center rounded-2xl border bg-card">
      <BorderBeam size={64} duration={6} />
      <p className="text-sm text-muted-foreground">&lt;BorderBeam /&gt;</p>
    </div>
  ),
  "animated-beam": <IntegrationsBeam className="h-72" />,
  "blur-fade": (
    <div className="flex gap-3">
      {[0, 0.15, 0.3].map((delay) => (
        <BlurFade key={delay} delay={delay} once={false}>
          <div className="flex size-20 items-center justify-center rounded-xl border bg-card text-sm font-medium">
            {delay}s
          </div>
        </BlurFade>
      ))}
    </div>
  ),
  "scroll-progress": (
    <div className="w-full max-w-sm space-y-3">
      <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-brand-from via-brand-via to-brand-to" />
      <p className="text-sm text-muted-foreground">
        A live one is running at the top of this page — scroll to see it fill.
      </p>
    </div>
  ),
  "browser-mockup": (
    <BrowserMockup url="velora.dev" className="w-full max-w-md">
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-from/20 via-brand-via/15 to-brand-to/20">
        <p className="text-sm text-muted-foreground">Your product here</p>
      </div>
    </BrowserMockup>
  ),
  "iphone-mockup": (
    <IphoneMockup className="w-44">
      <div className="flex size-full items-center justify-center bg-gradient-to-b from-brand-from/25 to-brand-to/25 pt-10">
        <p className="text-xs text-muted-foreground">Your app here</p>
      </div>
    </IphoneMockup>
  ),
  terminal: (
    <Terminal
      className="max-w-md"
      lines={[
        "$ npx shadcn@latest add velora/marquee",
        "✔ Checking registry…",
        "✔ Installing dependencies…",
        "✔ Created components/velora/marquee.tsx",
      ]}
    />
  ),
  // ── Backgrounds ──────────────────────────────────────────────────
  "flickering-grid": (
    <div className={`${frame} relative bg-neutral-950 text-white/70`}>
      <FlickeringGrid columns={44} rows={16} />
      <p className="relative text-xl font-semibold text-white">Flickering Grid</p>
    </div>
  ),
  ripple: (
    <div className={`${frame} relative`}>
      <Ripple circles={5} baseSize={90} />
      <p className="relative text-xl font-semibold">Ripple</p>
    </div>
  ),
  "light-rays": (
    <div className={`${frame} relative bg-neutral-950`}>
      <LightRays count={7} />
      <p className="relative text-xl font-semibold text-white">Light Rays</p>
    </div>
  ),

  // ── Text ─────────────────────────────────────────────────────────
  "word-rotate": (
    <p className="text-2xl font-semibold">
      Build{" "}
      <WordRotate
        words={["faster", "lighter", "calmer"]}
        className="text-brand"
      />
    </p>
  ),
  "hyper-text": (
    <HyperText className="text-2xl font-semibold">VELORA UI</HyperText>
  ),
  "text-highlighter": (
    <p className="max-w-xs text-center text-lg">
      Every component ships{" "}
      <TextHighlighter>its own receipts</TextHighlighter>.
    </p>
  ),
  "morphing-text": (
    <div className="text-2xl font-semibold">
      <MorphingText texts={["Animate", "Measure", "Ship"]} />
    </div>
  ),

  // ── Buttons ──────────────────────────────────────────────────────
  "rainbow-button": <RainbowButton>Get started</RainbowButton>,
  "ripple-button": <RippleButton>Click me</RippleButton>,
  "magnetic-button": <MagneticButton>Hover me</MagneticButton>,
  "moving-border": <MovingBorder>Deploy</MovingBorder>,
  "theme-toggler": <ThemeTogglerDemo />,

  // ── Cards & Layout ───────────────────────────────────────────────
  "card-stack": (
    <CardStack
      className="h-44 max-w-xs"
      offset={10}
      items={quotes.map((q) => ({
        id: q.name,
        content: (
          <>
            <p className="text-sm leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
            <p className="text-xs text-muted-foreground">{q.name}</p>
          </>
        ),
      }))}
    />
  ),
  "glare-card": (
    <GlareCard className="w-full max-w-xs">
      <h3 className="font-medium">Glare Card</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Move the cursor across this card.
      </p>
    </GlareCard>
  ),
  "expandable-card": (
    <ExpandableCard
      title="Animations with receipts"
      subtitle="Click to expand"
      media={
        <div className="h-24 w-full bg-gradient-to-br from-brand-from/30 to-brand-to/30" />
      }
    >
      Every component publishes its gzipped size and dependency count.
    </ExpandableCard>
  ),
  "direction-aware-hover": (
    <DirectionAwareHover
      className="size-44"
      overlay={<span className="font-medium">Enters from your edge</span>}
    >
      <div className="flex size-full items-center justify-center bg-muted">
        <span className="text-sm text-muted-foreground">Hover me</span>
      </div>
    </DirectionAwareHover>
  ),
  "compare-slider": (
    <CompareSlider
      className="max-w-sm"
      before={
        <div className="flex size-full items-center justify-center bg-neutral-900 text-sm text-white">
          Before
        </div>
      }
      after={
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-brand-from to-brand-to text-sm text-white">
          After
        </div>
      }
    />
  ),
  "file-tree": (
    <FileTree
      className="max-w-xs text-xs"
      tree={[
        {
          name: "components",
          children: [
            {
              name: "velora",
              children: [{ name: "marquee.tsx" }, { name: "dock.tsx" }],
            },
            { name: "ui", children: [{ name: "button.tsx" }] },
          ],
        },
      ]}
    />
  ),

  // ── Navigation ───────────────────────────────────────────────────
  "floating-navbar": (
    <div className="w-full max-w-sm">
      {/* Static preview — the real component is fixed to the viewport. */}
      <div className="flex items-center justify-between gap-4 rounded-full border bg-background/80 px-5 py-2.5 shadow-lg backdrop-blur-md">
        <span className="text-sm font-semibold">Velora</span>
        <span className="text-sm text-muted-foreground">Docs</span>
        <span className="text-sm text-muted-foreground">Pricing</span>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Hides on scroll down, returns on scroll up
      </p>
    </div>
  ),
  "navbar-menu": (
    <NavbarMenu>
      <MenuItem label="Product">
        <p className="w-40 text-sm text-muted-foreground">Components, themes</p>
      </MenuItem>
      <MenuItem label="Docs" />
      <MenuItem label="Pricing" />
    </NavbarMenu>
  ),
  "sticky-banner": (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border">
      <StickyBanner className="static">
        <span className="text-sm">Velora 0.4 is out — 64 components</span>
      </StickyBanner>
      <div className="h-20 bg-muted/40" />
    </div>
  ),

  // ── Forms ────────────────────────────────────────────────────────
  "vanish-input": (
    <VanishInput
      className="max-w-xs"
      placeholders={[
        "Search components…",
        "Try 'border beam'",
        "Try 'bento grid'",
      ]}
    />
  ),
  "file-drop": <FileDrop className="max-w-xs" accept="image/*" />,
  stepper: (
    <Stepper className="max-w-xs" steps={["Account", "Plan", "Done"]} current={1} />
  ),

  // ── Social Proof ─────────────────────────────────────────────────
  "animated-testimonials": (
    <AnimatedTestimonials testimonials={quotes} className="max-w-sm" />
  ),
  "tweet-card": (
    <TweetCard
      name="Dana Whitfield"
      handle="danawhit"
      time="2h"
      verified
      content="Velora publishes the gzipped size of every component. Nobody else does this."
    />
  ),
  "logo-cloud": (
    <LogoCloud
      className="max-w-sm grid-cols-3 gap-6 lg:grid-cols-3"
      logos={chips.slice(0, 6).map((name) => ({
        name,
        logo: <span className="text-sm font-semibold">{name}</span>,
      }))}
    />
  ),

  // ── Scroll ───────────────────────────────────────────────────────
  "sticky-scroll": (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-2 w-full rounded bg-foreground/80" />
          <div className="h-2 w-3/4 rounded bg-muted-foreground/30" />
          <div className="h-2 w-2/3 rounded bg-muted-foreground/30" />
        </div>
        <div className="h-20 flex-1 rounded-lg border bg-gradient-to-br from-brand-from/15 to-brand-to/15" />
      </div>
      <p className="text-xs text-muted-foreground">
        Copy scrolls; the panel stays pinned and swaps per section.
      </p>
    </div>
  ),
  "container-scroll": (
    <ContainerScroll className="w-full max-w-xs">
      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-brand-from/20 to-brand-to/20 text-sm text-muted-foreground">
        Your screenshot
      </div>
    </ContainerScroll>
  ),
  "tracing-beam": (
    <TracingBeam className="max-w-xs pl-6">
      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-muted-foreground/25" />
        <div className="h-2 w-4/5 rounded bg-muted-foreground/25" />
        <div className="h-2 w-3/5 rounded bg-muted-foreground/25" />
        <p className="pt-2 text-xs text-muted-foreground">
          The beam draws as you read.
        </p>
      </div>
    </TracingBeam>
  ),
  "scroll-velocity": (
    <ScrollVelocity className="text-2xl font-semibold text-muted-foreground">
      Velora UI · Animations with receipts ·
    </ScrollVelocity>
  ),
  "parallax-grid": (
    <ParallaxGrid className="w-full max-w-xs gap-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-14 rounded-lg bg-gradient-to-br from-brand-from/25 to-brand-to/25"
        />
      ))}
    </ParallaxGrid>
  ),
};
