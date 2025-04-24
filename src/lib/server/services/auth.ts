import { Surreal } from "surrealdb";

import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { surrealAdapter } from "surreal-better-auth";

import { AUTH_SECRET, DB_CLIENT, DB_SERVER } from "$lib/server/consts.ts";

// Initialize server-side DB connection once
const serverDb = new Surreal();
serverDb.connect(DB_SERVER.url, DB_SERVER.config).catch(console.error);

export const auth = betterAuth({
  database: surrealAdapter(serverDb),
  emailAndPassword: { enabled: true },
  secret: AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000"],
  advanced: { database: { generateId: false } },

  session: {
    expiresIn: 120,
    updateAge: 30,
    additionalFields: {
      client_token: {
        type: "string", // WARN: actually, it is an object
      },
    },
  },

  plugins: [
    customSession(async ({ user, session }) => {
      await ensureClientToken(session, user.email);

      return { user, session };
    }),
  ],
});

// Helper to create and connect a Surreal instance
async function createSurrealConnection(
  url: string,
  config: any,
): Promise<Surreal> {
  const instance = new Surreal();
  await instance.connect(url, { ...config });

  return instance;
}

// Fetch or refresh the client_token for a session
async function ensureClientToken(session: any, email: string): Promise<void> {
  const tokenInfo = session.client_token;
  const nowSeconds = Math.floor(Date.now() / 1000);

  // Compute last update times in seconds
  const tokenUpdatedSec = tokenInfo?.updated
    ? Math.floor(new Date(tokenInfo.updated).getTime() / 1000)
    : 0;

  const sessionUpdatedSec = Math.floor(
    new Date(session.updatedAt).getTime() / 1000,
  );

  // If missing or stale, generate a new one
  if (!tokenInfo || tokenUpdatedSec < sessionUpdatedSec) {
    const db = await createSurrealConnection(DB_CLIENT.url, DB_CLIENT.config);
    const token = await db.signin({
      access: DB_CLIENT.config.access,
      variables: { email },
    });
    const newToken = { token, updated: new Date(nowSeconds * 1000) };

    await db.merge(session.id, { client_token: newToken });
    await db.close();

    session.client_token = newToken;
  }
}
