import Image from "next/image";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import ProjectCarousel from "@/components/ProjectCarousel";

export type MediaItem = {
  light: string;
  dark: string;
  alt: string;
  aspect?: string;
};

export type ProjectMediaConfig = {
  slug: string;
  altPrefix: string;
  alts?: Record<string, string>;
  aspect?: string;
};

type Props = {
  config?: ProjectMediaConfig;
  priority?: boolean;
};

const SUPPORTED_EXT = /\.(png|jpg|jpeg|webp)$/i;
const VARIANT_SUFFIX = /-(light|dark)$/i;

function discoverMedia(config: ProjectMediaConfig): MediaItem[] {
  const dir = path.join(process.cwd(), "public", "projects", config.slug);
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir);
  const alts = config.alts ?? {};

  type Pair = { basename: string; light?: string; dark?: string };
  const groups = new Map<string, Pair>();

  for (const file of files) {
    if (!SUPPORTED_EXT.test(file)) continue;
    const stem = file.replace(SUPPORTED_EXT, "");
    const variantMatch = stem.match(VARIANT_SUFFIX);
    const basename = variantMatch ? stem.replace(VARIANT_SUFFIX, "") : stem;
    const variant = variantMatch?.[1].toLowerCase() as
      | "light"
      | "dark"
      | undefined;
    const url = `/projects/${config.slug}/${file}`;
    const existing = groups.get(basename) ?? { basename };
    if (variant === "dark") existing.dark = url;
    else if (variant === "light") existing.light = url;
    else {
      existing.light ??= url;
      existing.dark ??= url;
    }
    groups.set(basename, existing);
  }

  const pairs: { basename: string; item: MediaItem }[] = [];
  for (const group of groups.values()) {
    const fallback = group.light ?? group.dark;
    if (!fallback) continue;
    const alt =
      alts[group.basename] ??
      (group.basename === "hero"
        ? config.altPrefix
        : `${config.altPrefix} screenshot ${group.basename}`);
    pairs.push({
      basename: group.basename,
      item: {
        light: group.light ?? fallback,
        dark: group.dark ?? fallback,
        alt,
        aspect: config.aspect,
      },
    });
  }

  pairs.sort((a, b) => {
    if (a.basename === "hero") return -1;
    if (b.basename === "hero") return 1;
    const an = Number(a.basename);
    const bn = Number(b.basename);
    const aNum = Number.isFinite(an);
    const bNum = Number.isFinite(bn);
    if (aNum && bNum) return an - bn;
    if (aNum) return -1;
    if (bNum) return 1;
    return a.basename.localeCompare(b.basename);
  });

  return pairs.map((p) => p.item);
}

export default function ProjectMedia({ config, priority = false }: Props) {
  if (!config) return null;
  const items = discoverMedia(config);
  if (items.length === 0) return null;
  if (items.length === 1) {
    return <SingleFrame item={items[0]} priority={priority} />;
  }
  return <ProjectCarousel items={items} priority={priority} />;
}

function SingleFrame({
  item,
  priority,
}: {
  item: MediaItem;
  priority?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border border-border/70 bg-muted/20"
      style={{ aspectRatio: item.aspect ?? "16 / 9.5" }}
    >
      <Image
        src={item.light}
        alt={item.alt}
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        priority={priority}
        className="object-cover dark:hidden"
      />
      <Image
        src={item.dark}
        alt={item.alt}
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        priority={priority}
        className="hidden object-cover dark:block"
      />
    </div>
  );
}
