"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/components/ProjectMedia";

type Props = {
  items: MediaItem[];
  priority?: boolean;
};

export default function ProjectCarousel({ items, priority = false }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect).on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="space-y-3">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent className="ml-0">
          {items.map((item, i) => (
            <CarouselItem
              key={item.light}
              className="pl-0"
              aria-label={`${i + 1} of ${items.length}`}
            >
              <div
                className="relative overflow-hidden rounded-lg border border-border/70 bg-muted/20"
                style={{ aspectRatio: item.aspect ?? "16 / 9.5" }}
              >
                <Image
                  src={item.light}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  priority={priority && i === 0}
                  className="object-cover dark:hidden"
                />
                <Image
                  src={item.dark}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  priority={priority && i === 0}
                  className="hidden object-cover dark:block"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden -left-3 size-7 sm:inline-flex sm:-left-10" />
        <CarouselNext className="hidden -right-3 size-7 sm:inline-flex sm:-right-10" />
      </Carousel>

      <div className="flex justify-center gap-2">
        {items.map((item, i) => {
          const active = i === selectedIndex;
          return (
            <button
              key={`thumb-${item.light}`}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Show ${item.alt}`}
              aria-current={active}
              className={cn(
                "relative h-12 w-20 shrink-0 overflow-hidden rounded border transition-colors duration-200 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-14 sm:w-24",
                active
                  ? "border-foreground/40"
                  : "border-border/60 hover:border-foreground/30",
              )}
            >
              <Image
                src={item.light}
                alt=""
                fill
                sizes="96px"
                className="object-cover dark:hidden"
              />
              <Image
                src={item.dark}
                alt=""
                fill
                sizes="96px"
                className="hidden object-cover dark:block"
              />
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 transition-opacity duration-200 ease-out",
                  active ? "opacity-0" : "bg-black/65 opacity-100",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
