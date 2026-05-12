import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import FadeUp from "@/components/motion/FadeUp";
import StackToggle from "@/components/motion/StackToggle";
import ProjectMedia from "@/components/ProjectMedia";
import { PROJECTS } from "./data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects — AI-powered platforms, developer tools, and infrastructure built across web, mobile, and desktop.",
  openGraph: {
    title: "Projects · Ben Gregory",
    description: "Selected projects across AI, developer tools, and infra",
    type: "website",
    url: "https://bengregory.com/projects",
  },
};


export default function Projects() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <FadeUp as="header" className="mb-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A short list of things I&rsquo;ve built. Most are still running; one
          is a community. Click through to the live site for any of them.
        </p>
      </FadeUp>

      <div className="space-y-12">
        {PROJECTS.map((project, i) => (
          <FadeUp key={project.name} delay={i * 0.06}>
            <article
              id={project.name.toLowerCase().replace(/\s+/g, "-")}
              className="scroll-mt-20 space-y-5"
            >
              {/* Header row */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-baseline gap-3">
                  <h2 className="font-display text-2xl font-semibold">
                    {project.name}
                  </h2>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {project.year}
                  </span>
                </div>
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="anim-underline inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {project.site}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>


              {/* Pitch + body */}
              <div className="space-y-3">
                <p className="text-base font-medium text-foreground">
                  {project.pitch}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.body}
                </p>
              </div>


              {/* Primary stack chips */}
              <div className="flex flex-wrap gap-1.5">
                {project.primaryStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-foreground/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Full stack toggle (animated) */}
              <StackToggle stack={project.fullStack} />

              <ProjectMedia config={project.media} priority={i === 0} />

            </article>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
