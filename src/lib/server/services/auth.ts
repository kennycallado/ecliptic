import { admin } from "better-auth/plugins";
import { betterAuth } from "better-auth";
import { surrealAdapter } from "surreal-better-auth";

import { AUTH_SECRET } from "$lib/server/consts.ts";
import { adminRole, theraRoles, userRole } from "$lib/roles.ts";
import { dbService } from "$lib/server/services/database.ts";
import { catchErrorTyped } from "$lib/utils.ts";

export const auth = betterAuth({
  database: surrealAdapter(await dbService.getDB()),
  secret: AUTH_SECRET,
  trustedOrigins: ["http://localhost:3000"],
  advanced: { database: { generateId: false } },

  session: {
    cookieCache: { enabled: true, maxAge: 60 * 60 * 24 }, // one day
    expiresIn: 60 * 60 * 24 * 14, // two weeks // NOTE: should > surrealdb TOKEN
    updateAge: 60 * 60 * 24 * 2, // two days
  },

  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        const { error: errorDB, data: db } = await catchErrorTyped(
          dbService.getDB(),
        );

        if (errorDB) throw new Error("Database connection error");

        const { error, data } = await catchErrorTyped(db.query<string[]>(
          "crypto::argon2::generate($password)",
          { password },
        ));

        if (error) throw new Error("Password hashing error");

        return data[0];
      },

      verify: async ({ hash, password }) => {
        const { error: errorDB, data: db } = await catchErrorTyped(
          dbService.getDB(),
        );

        if (errorDB) throw new Error("Database connection error");

        const { error, data } = await catchErrorTyped(db.query<boolean[]>(
          "crypto::argon2::compare($hash, $password)",
          { password, hash },
        ));

        if (error) throw new Error("Password verification error");

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
