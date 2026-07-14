import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

// Pools are cached on globalThis so next dev HMR doesn't leak connections
// (one pool per env var per process, ever).
const store = globalThis as unknown as { __adminPools?: Map<string, Sql> };

export function db(envVar: string): Sql | null {
  const url = process.env[envVar];
  if (!url) return null;
  const pools = (store.__adminPools ??= new Map());
  let sql = pools.get(envVar);
  if (!sql) {
    sql = postgres(url, {
      max: 2,
      idle_timeout: 20,
      connect_timeout: 10,
      // No prepared statements — required through Supabase's transaction
      // pooler (port 6543), harmless on direct/session connections.
      prepare: false,
    });
    pools.set(envVar, sql);
  }
  return sql;
}
