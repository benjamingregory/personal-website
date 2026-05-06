import type { Metadata } from "next";
import { Instrument_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/motion/PageTransition";
import { WebSiteJsonLd, PersonJsonLd } from "@/components/JsonLd";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const setInitialTheme = `(function(){try{var ls=localStorage.getItem('darkMode');var d=ls==='true'||(!ls&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "Ben Gregory",
    template: "%s · Ben Gregory",
  },
  description:
    "Engineer, founder, and writer. Currently building Kasava, an AI workflow tool for engineering teams.",
  keywords: ["Ben Gregory", "Software Engineer", "Founder", "Writer", "Kasava"],
  authors: [{ name: "Ben Gregory" }],
  creator: "Ben Gregory",
  metadataBase: new URL("https://bengregory.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bengregory.com",
    siteName: "Ben Gregory",
    title: "Ben Gregory",
    description:
      "Engineer, founder, and writer. Currently building Kasava.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ben Gregory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ben Gregory",
    description: "Engineer, founder, and writer.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${outfit.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground">
        <WebSiteJsonLd
          name="Ben Gregory"
          description="Personal site of Ben Gregory — engineer, founder, and writer"
          url="https://bengregory.com"
        />
        <PersonJsonLd
          name="Ben Gregory"
          jobTitle="Software Engineer"
          description="Engineer, founder, and writer"
          url="https://bengregory.com"
          sameAs={[
            "https://github.com/benjamingregory",
            "https://www.linkedin.com/in/benjamin-gregory",
          ]}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
