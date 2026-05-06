import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import FadeUp from "@/components/motion/FadeUp";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Stanford GSB MBA, Venture for America Fellowship, BA Economics from Washington University in St. Louis.",
  openGraph: {
    title: "Education · Ben Gregory",
    description: "Stanford GSB, Venture for America, Washington University",
    type: "website",
    url: "https://bengregory.com/education",
  },
};

const SCHOOLS = [
  {
    degree: "MBA",
    school: "Stanford Graduate School of Business",
    year: "2019 — 2021",
    award: "USA Fellow (Full Scholarship)",
    link: "https://www.gsb.stanford.edu",
  },
  {
    degree: "Fellow",
    school: "Venture for America",
    year: "2013 — 2015",
    award: "2nd Class of Fellows",
    link: "https://ventureforamerica.org",
  },
  {
    degree: "BA, Economics",
    school: "Washington University in St. Louis",
    year: "2009 — 2013",
    award: "Magna Cum Laude",
    link: "https://economics.wustl.edu",
  },
];

export default function Education() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <FadeUp as="header" className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Education
        </h1>
      </FadeUp>

      <ul className="divide-y divide-border/60">
        {SCHOOLS.map((s, i) => (
          <FadeUp key={s.school} delay={i * 0.05} as="div">
            <li className="grid gap-1 py-6 sm:grid-cols-[160px_1fr] sm:gap-8">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground sm:pt-1">
                {s.year}
              </div>
              <div className="space-y-1">
                <div className="font-display text-lg font-semibold">
                  {s.degree}
                  <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
                    {s.award}
                  </span>
                </div>
                <Link
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="anim-underline inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {s.school}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </li>
          </FadeUp>
        ))}
      </ul>
    </div>
  );
}
