import type { Metadata } from "next";
import { Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

// Alternative is
// 1) Rubrik
// 2) Outfit
// 3) Space Grotesk

const font = Source_Code_Pro({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Ben Gregory",
  description: "Personal Website of Ben Gregory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="flex">
          <Sidebar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
