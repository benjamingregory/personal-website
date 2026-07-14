import type { DailyPoint } from "@/lib/metrics/types";

// Flat aspect (~9:1) so the sparkline stays a strip, not a chart, at full
// card width.
const W = 480;
const H = 52;
const PLOT_TOP = 6;
const PLOT_BOTTOM = 42;

function fmtDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Server-rendered single-series sparkline. Identity lives in the accent
// stroke; all text stays in ink tokens. Native <title> tooltips give a
// per-day readout without client JS. `prefix` renders before every value
// ("$" for spend series); the window label follows the series length.
export function Sparkline({
  points,
  label,
  accent,
  prefix = "",
}: {
  points: DailyPoint[];
  label: string;
  accent: string;
  prefix?: string;
}) {
  const max = Math.max(...points.map((p) => p.value), 1);
  const step = W / Math.max(points.length - 1, 1);
  const y = (v: number) =>
    PLOT_BOTTOM - (v / max) * (PLOT_BOTTOM - PLOT_TOP);
  const coords = points.map((p, i) => [i * step, y(p.value)] as const);
  const line = coords
    .map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${W},${PLOT_BOTTOM} L0,${PLOT_BOTTOM} Z`;
  const lastPoint = points[points.length - 1];
  const last = coords[coords.length - 1];
  const total = points.reduce((sum, p) => sum + p.value, 0);

  return (
    <figure>
      <figcaption className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {label}
        </span>
        <span className="text-xs tabular-nums text-ink-dim">
          {prefix}
          {total.toLocaleString("en-US")} / {points.length}d
        </span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 w-full"
        role="img"
        aria-label={`${label}, last 30 days, total ${total}`}
      >
        <line
          x1="0"
          y1={PLOT_BOTTOM}
          x2={W}
          y2={PLOT_BOTTOM}
          stroke="var(--color-rule)"
          strokeWidth="1"
        />
        {total > 0 && (
          <>
            <path d={area} fill={accent} opacity="0.09" />
            <path
              d={line}
              fill="none"
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {last && (
              <circle cx={last[0]} cy={last[1]} r="3" fill={accent} />
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
            <title>{`${fmtDay(p.day)} — ${prefix}${p.value.toLocaleString("en-US")}`}</title>
          </rect>
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-ink-faint">
        <span>{points.length ? fmtDay(points[0].day) : ""}</span>
        <span>
          {lastPoint
            ? `${fmtDay(lastPoint.day)} · ${prefix}${lastPoint.value.toLocaleString("en-US")}`
            : ""}
        </span>
      </div>
      {total === 0 && (
        <p className="mt-1 text-xs text-ink-faint">
          quiet — nothing in {points.length}d
        </p>
      )}
    </figure>
  );
}
