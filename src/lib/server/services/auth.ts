import { Surreal } from "surrealdb";

import { betterAuth } from "better-auth";
import { surrealAdapter } from "surreal-better-auth";

import { AUTH_SECRET, DB_SERVER } from "$lib/server/consts.ts";

// Initialize server-side DB connection once
const serverDb = new Surreal();
serverDb
  .connect(DB_SERVER.url, {
    namespace: DB_SERVER.config.namespace,
    database: DB_SERVER.config.database,
    auth: DB_SERVER.config,
  })
  .catch(console.error);

export const auth = betterAuth({
  database: surrealAdapter(serverDb),
  emailAndPassword: { enabled: true },
  secret: AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000"],
  advanced: { database: { generateId: false } },

  session: {
    expiresIn: 120,
    updateAge: 30,
  },

  plugins: [],
});
