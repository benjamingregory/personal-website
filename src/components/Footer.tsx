import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border/60 py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <span>© {year} Ben Gregory</span>
          <Link
            href="/education"
            className="anim-underline transition-colors hover:text-foreground sm:hidden"
          >
            Education
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span>benjaminrgregory at gmail dot com</span>
          <Link
            href="https://github.com/benjamingregory"
            target="_blank"
            rel="noreferrer"
            className="anim-underline transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/benjamin-gregory"
            target="_blank"
            rel="noreferrer"
            className="anim-underline transition-colors hover:text-foreground"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
