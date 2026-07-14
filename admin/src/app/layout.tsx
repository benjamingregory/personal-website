import type { Metadata } from "next";
import Link from "next/link";
import { JetBrains_Mono, Newsreader } from "next/font/google";
import { AutoRefresh } from "@/components/auto-refresh";
import { DeskNav } from "@/components/desk-nav";
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

const REFRESH_SECONDS = 60;

// Slim identity bar — the page belongs to the data, not the byline. State
// (overall status, timestamp) lives in the status strip on the overview.
function TopBar() {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-4">
        <p className="flex items-baseline gap-3">
          <Link
            href="/"
            prefetch={false}
            className="font-display text-lg italic tracking-tight text-ink"
          >
            operations
          </Link>
          <span className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
            benjaminrgregory.com
          </span>
        </p>
        <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          Private · No index
        </p>
      </div>
      <DeskNav />
    </header>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-12 pt-10">
      <div className="border-t border-rule-soft pt-4 text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        Read straight from each project&rsquo;s database · auto-refreshes
        every 60s · production hosts only
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
        <TopBar />
        {children}
        <Footer />
        <AutoRefresh seconds={REFRESH_SECONDS} />
      </body>
    </html>
  );
}
