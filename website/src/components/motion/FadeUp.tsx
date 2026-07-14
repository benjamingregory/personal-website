import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer";
};

/**
 * Server component: the fade-up runs as a pure CSS animation (.anim-fade-up
 * in globals.css), so content is present in the server HTML and paints
 * without waiting for hydration. Sections animate once on load — an
 * orchestrated entrance via staggered delays — instead of per-viewport-entry.
 * Reduced motion is handled in the CSS.
 */
export default function FadeUp({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: Props) {
  return (
    <Tag
      className={cn("anim-fade-up", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
