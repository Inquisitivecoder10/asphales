import handler from "vinext/server/fetch-handler";

// Protect this shared demo's production URL with Cloudflare Access.
// Demo role selectors do not provide account isolation.
const initialized = new WeakSet<object>();

async function initializeDatabase(database: D1Database) {
  if (initialized.has(database)) return;
  // Never share an in-flight D1 promise across requests. Concurrent cold
  // requests may safely execute these idempotent statements independently.
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL,
      version INTEGER DEFAULT 0 NOT NULL
    )`),
    database.prepare(`CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY NOT NULL,
      deal_id TEXT NOT NULL,
      name TEXT NOT NULL,
      mime TEXT NOT NULL,
      preview_mime TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
  ]);
  initialized.add(database);
}

export default {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext) {
    if (env.DB) {
      try {
        await initializeDatabase(env.DB);
      } catch (error) {
        console.error("ASPHALES database initialization failed", error);
        return new Response("The workspace database could not be initialized. Check the DB binding in Cloudflare.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      }
    }
    return handler.fetch(request, env, ctx);
  },
};
