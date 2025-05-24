import { Surreal } from "surrealdb";

import { admin } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { surrealAdapter } from "surreal-better-auth";

import { AUTH_SECRET, DB_SERVER } from "$lib/server/consts.ts";
import { adminRole, theraRoles, userRole } from "$lib/roles.ts";
import { catchErrorTyped } from "$lib/utils";

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
  secret: AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000"],
  advanced: { database: { generateId: false } },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // one day
    },
    expiresIn: 60 * 60 * 24 * 14, // two weeks // NOTE: should > surrealdb TOKEN
    updateAge: 60 * 60 * 24 * 2, // two days
  },

  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        { // scoped: db ready
          const { error } = await catchErrorTyped(serverDb.ready);
          if (error) {
            console.error("SurrealDB is not ready:", error);
            throw new Error("Database connection error");
          }
        }

        const { error, data } = await catchErrorTyped(
          serverDb.query<string[]>("crypto::argon2::generate($password)", {
            password,
          }),
        );

        if (error) {
          console.error("Error generating password hash:", error);
          throw new Error("Password hashing error");
        }

        return data[0];
      },

      verify: async ({ hash, password }) => {
        { // scoped: db ready
          const { error } = await catchErrorTyped(serverDb.ready);
          if (error) {
            console.error("SurrealDB is not ready:", error);
            throw new Error("Database connection error");
          }
        }

        const { error, data } = await catchErrorTyped(
          serverDb.query<boolean[]>(
            "crypto::argon2::compare($hash, $password)",
            {
              password,
              hash,
            },
          ),
        );

        if (error) {
          console.error("Error verifying password hash:", error);
          throw new Error("Password verification error");
        }

        return data[0];
      },
    },
  },

  plugins: [
    admin({
      roles: {
        user: userRole,
        admin: adminRole,
        thera: theraRoles,
      },
    }),
  ],
});
