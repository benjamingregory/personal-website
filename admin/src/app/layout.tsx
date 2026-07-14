import type { Metadata } from "next";
import { JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Operations — Ben Gregory",
  description: "Private metrics desk for benjaminrgregory.com projects.",
  robots: { index: false, follow: false },
};

// Fine SVG noise, overlaid at very low opacity for print-like grain.
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

function Masthead() {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 16).replace("T", " ");
  return (
    <header className="mx-auto max-w-6xl px-6 pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        <span>Private · No index</span>
        <span suppressHydrationWarning>{stamp} UTC</span>
      </div>
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Benjamin R. Gregory
          <span className="text-ink-faint"> — </span>
          <em className="font-display italic text-ink-dim">operations</em>
        </h1>
        <p className="text-xs text-ink-faint">
          postgres ×3 · posthog · live on load
        </p>
      </div>
      <div className="mt-6 border-b-[3px] border-double border-rule" />
    </header>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-16">
      <div className="border-t border-rule-soft pt-4 text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        Numbers are read straight from each project&rsquo;s database on every
        load. Refresh for current values.
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh bg-ground font-mono text-ink antialiased">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.05]"
          style={{ backgroundImage: `url("${GRAIN}")` }}
        />
        <Masthead />
        {children}
        <Footer />
      </body>
    </html>
  );
}
