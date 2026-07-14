import type { TrendPoint } from "@/lib/posthog";

const W = 560;
const H = 116;
const PLOT_TOP = 8;
const PLOT_BOTTOM = 104;

function fmtDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

// Server-rendered two-series traffic trend, 30 days. Emphasis form: unique
// visitors carry the project accent (line + soft area); pageviews sit behind
// as a thin neutral context line. One shared y-scale — both series are day
// counts, so the taller pageview line frames the visitor line honestly.
// Identity never rides on color alone: the legend names each series. Native
// <title> tooltips give the per-day readout without client JS, and text stays
// in ink tokens — only marks wear the accent.
export function TrendChart({
  points,
  accent,
  title = "traffic · 30d",
}: {
  points: TrendPoint[];
  accent: string;
  // Pass "" when the chart sits under a section header that already names it.
  title?: string;
}) {
  const totalVisitors = points.reduce((sum, p) => sum + p.visitors, 0);
  const totalViews = points.reduce((sum, p) => sum + p.views, 0);
  const max = Math.max(...points.map((p) => Math.max(p.views, p.visitors)), 1);
  const step = W / Math.max(points.length - 1, 1);
  const y = (v: number) =>
    PLOT_BOTTOM - (v / max) * (PLOT_BOTTOM - PLOT_TOP);
  const line = (pick: (p: TrendPoint) => number) =>
    points
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${y(pick(p)).toFixed(1)}`,
      )
      .join(" ");
  const visitorsLine = line((p) => p.visitors);
  const viewsLine = line((p) => p.views);
  const area = `${visitorsLine} L${W},${PLOT_BOTTOM} L0,${PLOT_BOTTOM} Z`;
  const last = points[points.length - 1];
  const lastX = (points.length - 1) * step;

  return (
    <figure>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {title}
        </span>
        <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-ink-dim">
          <span className="flex items-baseline gap-1.5">
            <span
              aria-hidden
              className="inline-block size-2 self-center rounded-full"
              style={{ backgroundColor: accent }}
            />
            <span className="tabular-nums text-ink">{fmt(totalVisitors)}</span>
            visitors
          </span>
          <span className="flex items-baseline gap-1.5">
            <span
              aria-hidden
              className="inline-block size-2 self-center rounded-full bg-ink-faint"
            />
            <span className="tabular-nums text-ink">{fmt(totalViews)}</span>
            views
          </span>
        </span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full"
        role="img"
        aria-label={`Daily traffic, last 30 days: ${totalVisitors} visitors, ${totalViews} pageviews`}
      >
        {/* Recessive scale reference: solid hairlines at ½ and full height. */}
        <line
          x1="0"
          y1={PLOT_TOP}
          x2={W}
          y2={PLOT_TOP}
          stroke="var(--color-rule-soft)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1={y(max / 2)}
          x2={W}
          y2={y(max / 2)}
          stroke="var(--color-rule-soft)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1={PLOT_BOTTOM}
          x2={W}
          y2={PLOT_BOTTOM}
          stroke="var(--color-rule)"
          strokeWidth="1"
        />
        {totalViews + totalVisitors > 0 && (
          <>
            <path
              d={viewsLine}
              fill="none"
              stroke="var(--color-ink-faint)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d={area} fill={accent} opacity="0.09" />
            <path
              d={visitorsLine}
              fill="none"
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {last && (
              <>
                {/* Ground-colored rings keep the endpoint dots legible where
                    the two series meet. */}
                <circle
                  cx={lastX}
                  cy={y(last.views)}
                  r="3"
                  fill="var(--color-ink-faint)"
                  stroke="var(--color-ground)"
                  strokeWidth="2"
                />
                <circle
                  cx={lastX}
                  cy={y(last.visitors)}
                  r="4"
                  fill={accent}
                  stroke="var(--color-ground)"
                  strokeWidth="2"
                />
              </>
            )}
          </>
        )}
        {/* Invisible per-day hit targets → native tooltips. */}
        {points.map((p, i) => (
          <rect
            key={p.day}
            x={i * step - step / 2}
            y="0"
            width={step}
            height={H}
            fill="transparent"
          >
            <title>{`${fmtDay(p.day)} — ${fmt(p.visitors)} visitors · ${fmt(p.views)} views`}</title>
          </rect>
        ))}
      </svg>
      <div className="flex flex-wrap justify-between gap-x-4 text-[10px] text-ink-faint">
        <span>{points.length ? fmtDay(points[0].day) : ""}</span>
        <span>
          {last
            ? `${fmtDay(last.day)} · ${fmt(last.visitors)} visitors · ${fmt(last.views)} views`
            : ""}
        </span>
      </div>
      {totalViews + totalVisitors === 0 && (
        <p className="mt-1 text-xs text-ink-faint">quiet — nothing in 30d</p>
      )}
    </figure>
  );
}
