import type { CheckStatus } from "@/lib/metrics/types";

const DOT: Record<CheckStatus, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  err: "bg-err",
};

export const STATUS_TEXT: Record<CheckStatus, string> = {
  ok: "text-ok",
  warn: "text-warn",
  err: "text-err",
};

export function StatusDot({ status }: { status: CheckStatus }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-2 shrink-0 rounded-full ${DOT[status]}`}
    />
  );
}
