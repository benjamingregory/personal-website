import { Montserrat } from "next/font/google";

// Alternative is
// 1) Rubrik
// 2) Outfit
// 3) Space Grotesk

const font = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <div className="flex flex-col w-full h-full overflow-scroll items-center">
      <div className={font.className}>
        <div className="text-justify overflow-scroll sm:w-[600px] overflow-scroll scrollbar-hide px-4 pt-12 sm:h-[calc(100vh_-_50px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
