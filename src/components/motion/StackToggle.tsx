"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  stack: Record<string, string[]>;
};

export default function StackToggle({ stack }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-[color,transform] duration-150 ease-out hover:text-foreground active:scale-[0.97]"
      >
        <span>{open ? "Hide full stack" : "Show full stack"}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200 ease-out",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-[250ms] ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 pt-1">
            {Object.entries(stack).map(([category, items]) => (
              <div key={category} className="space-y-1.5">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {category}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] text-foreground/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
