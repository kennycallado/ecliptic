import { z } from "astro:schema";
import { ActionError, defineAction } from "astro:actions";

import { auth } from "$lib/server/services/auth.ts";
import { dbService } from "$lib/server/services/database.ts";
import { catchErrorTyped } from "$lib/utils/index.ts";

import likes from "./handlers/likes.ts";
import visits from "./handlers/visits.ts";

export const server = {
  getGreeting: defineAction({
    input: z.object({ name: z.string() }),

    handler: async (input) => {
      return `Hello, ${input.name}!`;
    },
  }),

  getGreetingLog: defineAction({
    handler: async (_input, context) => {
      // NOTE: just to ensure auth has a fresh db
      await catchErrorTyped(dbService.getDB());

      const isAuth = await auth.api.getSession({
        headers: context.request.headers,
      });

      if (!isAuth) {
        console.info("User is not authenticated.");

        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });
      }

      return `Hello, ${isAuth.user.name}!`;
    },
  }),

  likes,
  visits,
};
