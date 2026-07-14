import { NextRequest, NextResponse } from "next/server";

// HTTP Basic Auth over the whole app. Fails closed: no ADMIN_PASSWORD set →
// nothing is served. Credentials live in Vercel env / .env.local.

async function sha256(text: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return new Uint8Array(digest);
}

// Constant-time-ish comparison: compare fixed-length digests so the check
// doesn't leak prefix length. Works in both edge and node runtimes.
async function credentialsMatch(
  given: string,
  expected: string,
): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(given), sha256(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function proxy(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "ben";
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (expectedPass) {
    const header = req.headers.get("authorization");
    if (header?.startsWith("Basic ")) {
      const decoded = atob(header.slice(6));
      const sep = decoded.indexOf(":");
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (user === expectedUser && (await credentialsMatch(pass, expectedPass))) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse(
    expectedPass ? "Authentication required" : "ADMIN_PASSWORD is not set",
    {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="operations"' },
    },
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
