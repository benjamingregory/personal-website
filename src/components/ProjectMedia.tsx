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

const SUPPORTED_EXT = /-light\.(png|jpg|jpeg|webp)$/i;

function discoverMedia(config: ProjectMediaConfig): MediaItem[] {
  const dir = path.join(process.cwd(), "public", "projects", config.slug);
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir);
  const alts = config.alts ?? {};

  type Pair = { basename: string; item: MediaItem };

  const pairs: Pair[] = [];
  for (const lightFile of files) {
    const match = lightFile.match(SUPPORTED_EXT);
    if (!match) continue;
    const ext = match[1];
    const basename = lightFile.replace(SUPPORTED_EXT, "");
    const darkFile = `${basename}-dark.${ext}`;
    if (!files.includes(darkFile)) continue;
    const alt =
      alts[basename] ??
      (basename === "hero"
        ? config.altPrefix
        : `${config.altPrefix} screenshot ${basename}`);
    pairs.push({
      basename,
      item: {
        light: `/projects/${config.slug}/${lightFile}`,
        dark: `/projects/${config.slug}/${darkFile}`,
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
