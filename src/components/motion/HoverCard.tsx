import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  showArrow?: boolean;
};

export default function HoverCard({
  href,
  external,
  className,
  children,
  showArrow = true,
}: Props) {
  const linkProps = external
    ? { target: "_blank", rel: "noreferrer" }
    : undefined;

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-border bg-card text-card-foreground transition-[border-color,transform] duration-150 ease-out hover:border-foreground/30 motion-safe:hover:-translate-y-0.5 active:translate-y-0",
        className,
      )}
    >
      <Link
        href={href}
        {...linkProps}
        className="block h-full w-full p-5 sm:p-6"
      >
        {children}
        {showArrow && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-4 top-4 text-muted-foreground transition-[color,transform] duration-200 ease-out group-hover:text-foreground motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </Link>
    </div>
  );
}
