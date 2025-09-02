import type { Metadata } from "next";
import {
  Source_Code_Pro,
  Rubik,
  Outfit,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { WebSiteJsonLd, PersonJsonLd } from "@/components/JsonLd";

// Alternative is
// 1) Rubrik
// 2) Outfit
// 3) Space Grotesk

const font = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: {
    default: "Ben Gregory - Software Engineer & Developer",
    template: "%s | Ben Gregory",
  },
  description: "Personal website and portfolio of Ben Gregory - Software Engineer specializing in web development, showcasing projects, blog posts, and professional experience.",
  keywords: ["Ben Gregory", "Software Engineer", "Web Developer", "Portfolio", "Blog", "Projects"],
  authors: [{ name: "Ben Gregory" }],
  creator: "Ben Gregory",
  metadataBase: new URL("https://bengregory.com"), // Update with your actual domain
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bengregory.com",
    siteName: "Ben Gregory",
    title: "Ben Gregory - Software Engineer & Developer",
    description: "Personal website and portfolio of Ben Gregory - Software Engineer specializing in web development",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Ben Gregory - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ben Gregory - Software Engineer & Developer",
    description: "Personal website and portfolio of Ben Gregory",
    images: ["/og-image.jpg"],
    creator: "@bengregory", // Update with your Twitter handle
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
  verification: {
    google: "", // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <WebSiteJsonLd
          name="Ben Gregory"
          description="Personal website and portfolio of Ben Gregory - Software Engineer"
          url="https://bengregory.com"
        />
        <PersonJsonLd
          name="Ben Gregory"
          jobTitle="Software Engineer"
          description="Software Engineer specializing in web development, AI, and product development"
          url="https://bengregory.com"
          sameAs={[
            "https://github.com/bengregory", // Update with actual GitHub
            "https://linkedin.com/in/bengregory", // Update with actual LinkedIn
            "https://twitter.com/bengregory", // Update with actual Twitter
          ]}
        />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded">
          Skip to main content
        </a>
        <div className="flex">
          <Sidebar />
          <div className="w-full h-screen flex justify-end flex-col">
            <main id="main-content" className="h-screen">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
