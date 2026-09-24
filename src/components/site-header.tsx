import Link from "next/link";
import { SparklesIcon, StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          StegoAnim 2D
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#workflow" className="transition-colors hover:text-foreground">
            Alur Kerja
          </Link>
          <Link href="#features" className="transition-colors hover:text-foreground">
            Metode &amp; Fitur
          </Link>
          <Link href="#process" className="transition-colors hover:text-foreground">
            Embedding &amp; Extraction
          </Link>
          <Link href="#evaluation" className="transition-colors hover:text-foreground">
            Hasil Riset
          </Link>
          <Link href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" variant="ghost" asChild className="hidden sm:inline-flex text-xs">
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">
              Mulai Uji Coba
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
