import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-16">
      <p className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
        404 · no such desk
      </p>
      <p className="mt-3 text-sm text-ink-dim">
        Nothing is tracked at this address.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          prefetch={false}
          className="text-[10px] uppercase tracking-[0.2em] text-ink-faint underline decoration-rule underline-offset-4 hover:text-ink-dim"
        >
          ← overview
        </Link>
      </p>
    </main>
  );
}
