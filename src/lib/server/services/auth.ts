import { Surreal } from "surrealdb";

import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { surrealAdapter } from "surreal-better-auth";

import { AUTH_SECRET, DB } from "$lib/server/consts.ts";
import { DB as clientDB } from "$lib/client/consts.ts";

const db = new Surreal();
db.connect(DB.url, { ...DB.config });

export const auth = betterAuth({
  database: surrealAdapter(db),
  emailAndPassword: { enabled: true },

  secret: AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000"],
  advanced: { database: { generateId: false } }, // already done

  plugins: [
    customSession(async ({ user, session }) => {
      const client_token = await db.signin({
        access: clientDB.config.access,
        variables: { email: user.email },
      });

      return {
        user,
        session,
        client_token,
      };
    }),
  ],
});
