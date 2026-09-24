import {
  CheckIcon,
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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ActivityList } from "@/components/demo/activity-list";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroMockup } from "@/components/demo/hero-mockup";
import { IntegrationsBeam } from "@/components/demo/integrations-beam";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { AvatarCircles } from "@/components/velora/avatar-circles";
import { BentoCard, BentoGrid } from "@/components/velora/bento-grid";
import { BlurFade } from "@/components/velora/blur-fade";
import { BorderBeam } from "@/components/velora/border-beam";
import { Dock, DockIcon } from "@/components/velora/dock";
import { DotPattern, GridPattern } from "@/components/velora/grid-pattern";
import { Marquee } from "@/components/velora/marquee";
import { Meteors } from "@/components/velora/meteors";
import { NumberTicker } from "@/components/velora/number-ticker";
import { OrbitingCircles } from "@/components/velora/orbiting-circles";
import { Particles } from "@/components/velora/particles";
import { RetroGrid } from "@/components/velora/retro-grid";
import { ScrollProgress } from "@/components/velora/scroll-progress";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { TextReveal } from "@/components/velora/text-reveal";
import { TiltCard } from "@/components/velora/tilt-card";
import { Typewriter } from "@/components/velora/typewriter";

const logos = [
  "OpenCV",
  "FFmpeg",
  "Next.js",
  "Python",
  "Tailwind CSS",
  "NumPy",
  "WebAssembly",
  "Motion",
];

const stats = [
  { value: 52, suffix: " dB+", prefix: "> ", label: "Kualitas Citra (PSNR)" },
  { value: 100, suffix: "%", prefix: "", label: "Akurasi Ekstraksi Pesan" },
  { value: 1, suffix: " Bit", prefix: "", label: "Metode LSB Presisi" },
  { value: 2, suffix: "D", prefix: "Animasi ", label: "Media Cover Video" },
];

const testimonials = [
  {
    quote:
      "Perubahan visual antar-frame pada video animasi 2D sangat efektif dalam menyamarkan modifikasi bit LSB sehingga tidak terdeteksi oleh indra penglihatan manusia.",
    name: "Analisis Imperceptibility",
    role: "Hasil Pengujian Visual (PSNR > 50 dB)",
  },
  {
    quote:
      "Penerapan threshold dinamis berhasil memisahkan frame statis dan memilih hanya frame dengan dinamika gerak signifikan sebagai lokasi penyisipan.",
    name: "Inter-Frame Difference",
    role: "Evaluasi Pemilihan Frame",
  },
  {
    quote:
      "Proses ekstraksi bit LSB mampu menyusun kembali pesan rahasia secara utuh tanpa ada karakter yang korup atau hilang.",
    name: "Integritas Pesan",
    role: "Pengujian Ekstraksi (Bit Error Rate = 0%)",
  },
  {
    quote:
      "Rekonstruksi seluruh frame menjadi video stego mempertahankan durasi, frame rate, dan sinkronisasi audio video asli.",
    name: "Stabilitas Video Stego",
    role: "Validasi Format & Metadata",
  },
  {
    quote:
      "Video animasi 2D memiliki karakteristik warna tegas dan perpindahan objek yang khas, menjadikannya media cover ideal untuk steganografi modern.",
    name: "Karakteristik Animasi 2D",
    role: "Studi Media Cover",
  },
  {
    quote:
      "Sistem menyediakan alur dua arah yang konsisten antara tahapan embedding dan extraction dengan parameter threshold yang sinkron.",
    name: "Keandalan Sistem",
    role: "Uji Komunikasi Data Aman",
  },
];

const faqs = [
  {
    q: "Apa itu Steganografi Video Animasi 2D?",
    a: "Steganografi video adalah teknik menyembunyikan data atau pesan rahasia ke dalam berkas video animasi 2D sehingga keberadaan pesan tersebut tidak disadari oleh pihak ketiga ketika video diputar.",
  },
  {
    q: "Mengapa menggunakan metode Inter-Frame Difference?",
    a: "Inter-frame difference menganalisis perbedaan piksel visual antar-frame berurutan. Frame yang memiliki perubahan visual signifikan (melebihi nilai threshold) dipilih untuk disisipi pesan, sehingga penyisipan terdistribusi pada frame dinamis yang sulit dicurigai.",
  },
  {
    q: "Bagaimana cara kerja metode Least Significant Bit (LSB)?",
    a: "Metode LSB menyisipkan bit-bit pesan rahasia ke dalam bit paling tidak signifikan (bit terakhir) dari nilai warna piksel pada frame terpilih. Perubahan nilai bit ini tidak menghasilkan perbedaan warna yang tampak oleh mata manusia.",
  },
  {
    q: "Bagaimana penerima dapat mengekstrak kembali pesan aslinya?",
    a: "Penerima memasukkan video stego ke dalam sistem extraction. Sistem melakukan analisis inter-frame difference yang sama untuk mengidentifikasi frame-frame penyisipan, mengekstrak bit LSB dari setiap frame, dan menyusunnya kembali menjadi pesan asli.",
  },
  {
    q: "Apakah kualitas dan durasi video akan berubah setelah disisipi pesan?",
    a: "Tidak. Durasi, frame rate, dan resolusi video tetap sama persis. Modifikasi hanya terjadi pada bit terendah piksel frame tertentu dengan nilai PSNR tinggi (> 50 dB), sehingga perbedaan visual tidak kasat mata.",
  },
];

const embeddingSteps = [
  "Ekstraksi video animasi menjadi urutan frame",
  "Analisis selisih visual (Inter-Frame Difference)",
  "Seleksi frame dinamis berbasis ambang batas (Threshold)",
  "Penyisipan bit rahasia dengan metode LSB",
  "Rekonstruksi seluruh frame menjadi Video Stego",
];

const extractionSteps = [
  "Analisis struktur dan frame Video Stego",
  "Pendeteksian frame kandidat inter-frame",
  "Identifikasi lokasi bit pesan tersimpan",
  "Ekstraksi urutan bit Least Significant Bit",
  "Rekonstruksi utuh teks pesan rahasia",
];

export default function Home() {
  return (
    <main className="relative">
      <ScrollProgress />

      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-24 lg:pt-48 lg:pb-28">
        <AuroraBackground intensity="subtle" />
        <GridPattern
          width={48}
          height={48}
          className="fill-transparent stroke-border/60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 text-center lg:px-8">
          <BlurFade delay={0} direction="down">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-sm backdrop-blur">
              <SparklesIcon className="size-3.5 text-primary" />
              <span className="font-medium">
                Steganografi Video Animasi 2D • Inter-Frame Difference &amp; LSB
              </span>
            </span>
          </BlurFade>

          <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-balance lg:text-7xl">
            <TextReveal text="Komunikasi data rahasia yang" />{" "}
            <AnimatedGradientText>
              <Typewriter words={["aman.", "presisi.", "tak kasat mata."]} />
            </AnimatedGradientText>
          </h1>

          <BlurFade delay={0.35}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              Aplikasi web cerdas untuk menyembunyikan pesan rahasia ke dalam video
              animasi 2D. Memanfaatkan analisis selisih visual antar-frame (Inter-Frame
              Difference) berbasis threshold dan metode Least Significant Bit (LSB) untuk
              menjamin kerahasiaan tanpa merusak kualitas visual video.
            </p>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <ShimmerButton>
                  <RocketIcon className="size-4" />
                  Mulai Embedding Pesan
                </ShimmerButton>
              </Link>
              <Button variant="ghost" size="lg" asChild>
                <a href="#workflow">Pelajari Alur Kerja</a>
              </Button>
            </div>
          </BlurFade>

          <BlurFade delay={0.6}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <AvatarCircles
                people={[
                  "Maya Chen",
                  "Tom Okafor",
                  "Sofia Lindqvist",
                  "Dan Romero",
                  "Aisha Patel",
                ]}
                extra={2400}
              />
              <div className="flex flex-col items-center gap-0.5 sm:items-start">
                <span className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-4 fill-current" />
                  ))}
                </span>
                <span className="text-sm text-muted-foreground">
                  Tugas Capstone Projek Teknik Informatika 2026
                </span>
              </div>
            </div>
          </BlurFade>

          {/* Product mockup */}
          <BlurFade delay={0.75} offset={32}>
            <HeroMockup className="mt-20" />
          </BlurFade>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <BlurFade key={stat.label} delay={i * 0.1}>
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
            Didukung Teknologi Pemrosesan Video &amp; Web Modern
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
              Pendekatan Ilmiah untuk{" "}
              <span className="text-primary">Keamanan Data</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Kombinasi analisis perubahan visual antar-frame dan penyisipan bit LSB
              menghasilkan komunikasi rahasia yang tak kasat mata dan berintegritas tinggi.
            </p>
          </BlurFade>

          <BlurFade delay={0.15}>
            <BentoGrid className="mt-16">
              <BentoCard
                name="Inter-Frame Difference"
                description="Menganalisis selisih intensitas piksel antar-frame berurutan untuk menemukan frame dengan dinamika visual signifikan."
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
                name="Least Significant Bit (LSB)"
                description="Menyisipkan bit rahasia ke dalam bit terendah piksel tanpa menimbulkan distorsi visual pada animasi."
                className="md:col-span-2"
                background={
                  <div className="absolute inset-6 rounded-xl border bg-card/50">
                    <BorderBeam size={72} duration={7} />
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      &lt;LSB Engine /&gt;
                    </div>
                  </div>
                }
              />
              <BentoCard
                name="Kualitas Visual Imperceptible"
                description="Mempertahankan kualitas tampilan video animasi dengan nilai evaluasi PSNR tinggi dan error rate nol."
                className="md:col-span-2"
                background={
                  <div className="absolute inset-x-10 top-4 bottom-24">
                    <Marquee
                      vertical
                      pauseOnHover
                      className="h-full [--duration:24s]"
                    >
                      {[
                        "“PSNR stabil di atas 50 dB.”",
                        "“Tidak tampak glitch pada video animasi.”",
                        "“Bit pesan terdistribusi secara acak dan dinamis.”",
                        "“Pesan diekstraksi 100% tanpa karakter korup.”",
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
                name="Seleksi Berbasis Ambang Batas"
                description="Hanya frame dengan selisih visual di atas nilai threshold yang dipilih sebagai media penyisipan pesan."
                className="md:col-span-1"
                background={
                  <div className="absolute inset-0">
                    <DotPattern className="[mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
                    <Meteors number={10} />
                  </div>
                }
              />
            </BentoGrid>
          </BlurFade>
        </div>
      </section>

      {/* Integrations beam */}
      <section id="workflow" className="relative py-24 lg:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <BlurFade direction="right">
            <div>
              <span className="text-sm font-medium text-primary">
                Arsitektur Sistem
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
                Integrasi Alur Komunikasi{" "}
                <span className="text-primary">Dua Arah</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Sistem menghubungkan proses embedding di sisi pengirim dan extraction di sisi penerima
                secara simetris melalui parameter analisis frame yang sinkron.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Pemisahan video animasi 2D menjadi urutan frame beresolusi penuh",
                  "Penghitungan matriks perbedaan visual (inter-frame diff) berbasis threshold",
                  "Penyisipan dan ekstraksi bit pesan pada lapisan Least Significant Bit",
                  "Rekonstruksi kembali menjadi video stego dan pesan teks asli",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <CheckIcon className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>
          <BlurFade direction="left" delay={0.15}>
            <IntegrationsBeam />
          </BlurFade>
        </div>
      </section>

      {/* Live activity */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <RetroGrid />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <BlurFade direction="right" className="order-2 lg:order-1">
            <ActivityList />
          </BlurFade>
          <BlurFade direction="left" delay={0.15} className="order-1 lg:order-2">
            <div>
              <span className="text-sm font-medium text-primary">
                Log Pemrosesan Sistem
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance lg:text-4xl">
                Transparansi Proses{" "}
                <span className="text-primary">Setiap Frame</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Setiap tahapan—mulai dari ekstraksi frame, analisis selisih visual antarpiksel,
                penyisipan bit LSB, hingga uji kualitas PSNR—diproses secara terstruktur dan terukur.
              </p>
              <p className="mt-4 text-muted-foreground">
                Hasilnya adalah berkas video stego yang siap dikirimkan kepada penerima dengan
                keamanan data tingkat tinggi tanpa mengorbankan estetika animasi.
              </p>
            </div>
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
                title: "Kualitas Visual Terjaga (Imperceptible)",
                body: "Penyisipan bit pesan ke lapisan Least Significant Bit menghasilkan nilai PSNR di atas 50 dB, menjaga animasi tetap jernih tanpa cacat kasat mata.",
              },
              {
                icon: <MousePointerClickIcon className="size-6" />,
                title: "Seleksi Cerdas Berbasis Threshold",
                body: "Sistem secara otomatis mengabaikan frame statis dan memfokuskan penyisipan data pada frame dengan perubahan gerak dinamis.",
              },
              {
                icon: <MoonIcon className="size-6" />,
                title: "Integritas & Akurasi Pesan 100%",
                body: "Algoritma ekstraksi bit menjamin pesan asli dapat diurai kembali tanpa distorsi, error, atau kehilangan karakter rahasia.",
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

      {/* Testimonials / Evaluasi Riset */}
      <section id="evaluation" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <BlurFade>
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight text-balance lg:text-5xl">
              Hasil Analisis &amp; <span className="text-primary">Pengujian Riset</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Evaluasi karakteristik performa metode Inter-Frame Difference dan LSB pada video animasi 2D.
            </p>
          </BlurFade>
          <div className="mt-16 columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
            {testimonials.map((t, i) => (
              <BlurFade key={t.name} delay={(i % 3) * 0.1} className="break-inside-avoid">
                <TiltCard>
                  <figure className="rounded-2xl border bg-card p-6">
                    <span className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <StarIcon key={s} className="size-3.5 fill-current" />
                      ))}
                    </span>
                    <blockquote className="mt-4 text-sm text-card-foreground">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-4 flex items-center gap-3">
                      <AvatarCircles people={[t.name]} className="[&>span]:size-8 [&>span]:text-[10px]" />
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                </TiltCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Embedding & Extraction Modules */}
      <section id="process" className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <BlurFade>
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight text-balance lg:text-5xl">
              Dua Proses Inti: <span className="text-primary">Embedding &amp; Extraction</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
              Panduan tahapan teknis dari penyisipan data rahasia oleh pengirim hingga ekstraksi kembali oleh penerima.
            </p>
          </BlurFade>

          <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
            <BlurFade>
              <div className="flex h-full flex-col rounded-2xl border bg-card p-8">
                <h3 className="text-lg font-semibold">Proses Embedding</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tahapan penyisipan pesan rahasia ke dalam video animasi 2D.
                </p>
                <p className="mt-6 text-3xl font-semibold tracking-tight">
                  Penyisipan
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}(Sisi Pengirim)
                  </span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {embeddingSteps.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <CheckIcon className="size-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="lg" className="mt-8 w-full rounded-full" asChild>
                  <Link href="/signup">
                    Mulai Embedding Video
                  </Link>
                </Button>
              </div>
            </BlurFade>

            <BlurFade delay={0.12}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-8">
                <BorderBeam size={80} duration={8} />
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">Proses Extraction</h3>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    Sisi Penerima
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tahapan pengambilan dan penyusunan kembali pesan rahasia.
                </p>
                <p className="mt-6 text-3xl font-semibold tracking-tight">
                  Ekstraksi
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}(Sisi Penerima)
                  </span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {extractionSteps.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <CheckIcon className="size-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full">
                  <ShimmerButton className="mt-8 w-full">
                    Mulai Ekstraksi Pesan
                  </ShimmerButton>
                </Link>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <BlurFade>
            <h2 className="text-center text-3xl font-semibold tracking-tight lg:text-4xl">
              Pertanyaan Seputar Riset (FAQ)
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
        <AuroraBackground intensity="subtle" />
        <Particles quantity={50} />
        <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
          <BlurFade>
            <h2 className="text-4xl font-semibold tracking-tight text-balance lg:text-6xl">
              Komunikasi Data Aman Berbasis{" "}
              <span className="text-primary">Steganografi Video</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Sembunyikan dan ekstraksi pesan rahasia pada video animasi 2D dengan
              presisi tinggi menggunakan teknik Inter-Frame Difference dan LSB.
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <ShimmerButton className="h-14 px-10 text-base">
                  <RocketIcon className="size-5" />
                  Mulai Uji Coba Sekarang
                </ShimmerButton>
              </Link>
            </div>
          </BlurFade>
          <BlurFade delay={0.2}>
            <div className="mt-16">
              <p className="mb-4 text-xs text-muted-foreground">
                Navigasi Cepat Pipeline Steganografi
              </p>
              <Dock>
                <DockIcon label="Video Input">
                  <LayersIcon className="size-5" />
                </DockIcon>
                <DockIcon label="Frame Diff">
                  <PaletteIcon className="size-5" />
                </DockIcon>
                <DockIcon label="Threshold">
                  <GaugeIcon className="size-5" />
                </DockIcon>
                <DockIcon label="LSB Embed">
                  <ZapIcon className="size-5" />
                </DockIcon>
                <DockIcon label="Video Stego">
                  <MoonIcon className="size-5" />
                </DockIcon>
                <DockIcon label="Ekstraksi">
                  <RocketIcon className="size-5" />
                </DockIcon>
              </Dock>
            </div>
          </BlurFade>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
