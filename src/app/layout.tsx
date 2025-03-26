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

// Alternative is
// 1) Rubrik
// 2) Outfit
// 3) Space Grotesk

const font = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

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
          <div className="w-full h-screen flex justify-end flex-col">
            <div className="h-screen w-full">{children}</div>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
