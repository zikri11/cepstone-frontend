import Link from "next/link";
import {
  GaugeIcon,
  LayersIcon,
  MoonIcon,
  MousePointerClickIcon,
  PaletteIcon,
  RocketIcon,
  SparklesIcon,
  StarIcon,
  ZapIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BentoCard, BentoGrid } from "@/components/velora/bento-grid";
import { BlurFade } from "@/components/velora/blur-fade";
import { BorderBeam } from "@/components/velora/border-beam";
import { DotPattern, GridPattern } from "@/components/velora/grid-pattern";
import { Marquee } from "@/components/velora/marquee";
import { NumberTicker } from "@/components/velora/number-ticker";
import { OrbitingCircles } from "@/components/velora/orbiting-circles";
import { ScrollProgress } from "@/components/velora/scroll-progress";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { TextReveal } from "@/components/velora/text-reveal";
import { Typewriter } from "@/components/velora/typewriter";

const logos = [
  "Acme Corp",
  "Quantum",
  "Vertex",
  "Northwind",
  "Apex Labs",
  "Orbital",
  "Luminary",
  "Pulsewave",
];

const stats = [
  { value: 14, suffix: "+", prefix: "", label: "Animated components" },
  { value: 100, suffix: "", prefix: "", label: "Lighthouse performance" },
  { value: 0, suffix: "", prefix: "$", label: "Forever. MIT licensed" },
  { value: 5, suffix: " min", prefix: "", label: "To your first page" },
];

const faqs = [
  {
    q: "Is Velora UI really free?",
    a: "Yes — every component and the full landing template are MIT licensed. Use them in personal and commercial projects, no attribution required.",
  },
  {
    q: "How is this different from Magic UI?",
    a: "Velora ships complete, assembled landing pages — not just isolated components. Every animation respects prefers-reduced-motion, causes zero layout shift, and is tuned for mobile.",
  },
  {
    q: "What's the tech stack?",
    a: "Next.js 16, React 19, Tailwind CSS 4, shadcn/ui and Motion. Copy components via the CLI or clone the whole template.",
  },
  {
    q: "Will there be more templates?",
    a: "Yes. The SaaS template is free forever. Additional niches (AI agent, dev tool, mobile app, portfolio) and section variants land in Velora Pro.",
  },
];

export default function Home() {
  return (
    <main className="relative">
      <ScrollProgress />

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <SparklesIcon className="size-5 text-primary" />
            Velora UI
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Components
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
          <Button variant="outline" size="sm" asChild>
            <a href="https://github.com" rel="noopener">
              <StarIcon />
              Star on GitHub
            </a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-24 lg:pt-48 lg:pb-32">
        <AuroraBackground intensity="medium" />
        <GridPattern
          width={48}
          height={48}
          className="fill-transparent stroke-border/60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 text-center lg:px-8">
          <BlurFade delay={0} direction="down">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-sm backdrop-blur">
              <SparklesIcon className="size-3.5 text-primary" />
              <AnimatedGradientText className="font-medium">
                Introducing Velora UI — free forever
              </AnimatedGradientText>
            </span>
          </BlurFade>

          <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-balance lg:text-7xl">
            <TextReveal text="Landing pages that feel" />{" "}
            <AnimatedGradientText>
              <Typewriter words={["alive.", "effortless.", "unforgettable."]} />
            </AnimatedGradientText>
          </h1>

          <BlurFade delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              Free, open-source animated components and complete landing
              templates for React. Built on Next.js 16, Tailwind CSS 4 and
              shadcn/ui — accessible, reduced-motion friendly and tuned for
              perfect Lighthouse scores.
            </p>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <ShimmerButton>
                <RocketIcon className="size-4" />
                Get started — it&apos;s free
              </ShimmerButton>
              <Button variant="ghost" size="lg" asChild>
                <a href="#features">Browse components</a>
              </Button>
            </div>
          </BlurFade>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <BlurFade key={stat.label} delay={0.6 + i * 0.1}>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    <NumberTicker
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Logo marquee */}
      <section className="border-y border-border/40 py-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Trusted by teams shipping with modern React
          </p>
          <Marquee pauseOnHover className="[--duration:30s]">
            {logos.map((logo) => (
              <span
                key={logo}
                className="mx-8 text-xl font-semibold tracking-tight text-muted-foreground/60 transition-colors hover:text-foreground"
              >
                {logo}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Bento features */}
      <section id="features" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <BlurFade>
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight text-balance lg:text-5xl">
              Everything you need to{" "}
              <AnimatedGradientText>ship beautiful</AnimatedGradientText>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Assembled sections, not puzzle pieces. Every block below is built
              from Velora primitives you can copy into your own project.
            </p>
          </BlurFade>

          <BlurFade delay={0.15}>
            <BentoGrid className="mt-16">
              <BentoCard
                name="Orbiting integrations"
                description="Showcase your ecosystem with multi-ring orbit animations."
                className="md:col-span-1"
                background={
                  <div className="relative flex size-full items-center justify-center pb-20">
                    <ZapIcon className="size-8 text-primary" />
                    <OrbitingCircles radius={90} iconSize={28} duration={24}>
                      <LayersIcon className="size-5 text-muted-foreground" />
                      <PaletteIcon className="size-5 text-muted-foreground" />
                      <GaugeIcon className="size-5 text-muted-foreground" />
                    </OrbitingCircles>
                  </div>
                }
              />
              <BentoCard
                name="Animated borders"
                description="Draw the eye with beams that travel around any card or CTA."
                className="md:col-span-2"
                background={
                  <div className="absolute inset-6 rounded-xl border bg-card/50">
                    <BorderBeam size={72} duration={7} />
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      &lt;BorderBeam /&gt;
                    </div>
                  </div>
                }
              />
              <BentoCard
                name="Scrolling testimonials"
                description="Vertical marquees with hover-pause for social proof walls."
                className="md:col-span-2"
                background={
                  <div className="absolute inset-x-10 top-4 bottom-24">
                    <Marquee
                      vertical
                      pauseOnHover
                      className="h-full [--duration:24s]"
                    >
                      {[
                        "“Shipped our launch page in an afternoon.”",
                        "“The animations are buttery smooth.”",
                        "“Finally, free components that feel premium.”",
                        "“Lighthouse 100 out of the box.”",
                      ].map((quote) => (
                        <div
                          key={quote}
                          className="rounded-xl border bg-card/80 p-4 text-sm text-muted-foreground"
                        >
                          {quote}
                        </div>
                      ))}
                    </Marquee>
                  </div>
                }
              />
              <BentoCard
                name="Pattern backdrops"
                description="Grid and dot patterns with radial masks for subtle depth."
                className="md:col-span-1"
                background={
                  <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                }
              />
            </BentoGrid>
          </BlurFade>
        </div>
      </section>

      {/* Spotlight cards */}
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <GaugeIcon className="size-6" />,
                title: "Performance first",
                body: "CSS-driven animations wherever possible, Motion only where it earns its bytes. No layout shift, ever.",
              },
              {
                icon: <MousePointerClickIcon className="size-6" />,
                title: "Accessible by default",
                body: "Every component respects prefers-reduced-motion, keeps keyboard focus visible and ships semantic markup.",
              },
              {
                icon: <MoonIcon className="size-6" />,
                title: "Dark mode native",
                body: "Designed dark-first with oklch color tokens. Flip one class and every gradient adapts.",
              },
            ].map((card, i) => (
              <BlurFade key={card.title} delay={i * 0.12}>
                <SpotlightCard className="h-full p-8">
                  <div className="mb-4 w-fit rounded-xl bg-primary/10 p-3 text-primary">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {card.body}
                  </p>
                </SpotlightCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <BlurFade>
            <h2 className="text-center text-3xl font-semibold tracking-tight lg:text-4xl">
              Frequently asked questions
            </h2>
          </BlurFade>
          <BlurFade delay={0.15}>
            <Accordion type="single" collapsible className="mt-12">
              {faqs.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="text-left text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </BlurFade>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <AuroraBackground intensity="vivid" />
        <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
          <BlurFade>
            <h2 className="text-4xl font-semibold tracking-tight text-balance lg:text-6xl">
              Stop paying <AnimatedGradientText>$199</AnimatedGradientText> for
              landing pages.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Velora UI gives you the same polish — animated, accessible and
              production-ready — for free.
            </p>
            <div className="mt-10">
              <ShimmerButton className="h-14 px-10 text-base">
                <RocketIcon className="size-5" />
                Start building now
              </ShimmerButton>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row lg:px-8">
          <span className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-primary" />
            Velora UI — MIT licensed
          </span>
          <span>Built with Next.js 16, Tailwind CSS 4 & Motion</span>
        </div>
      </footer>
    </main>
  );
}
