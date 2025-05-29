import { z } from "astro:schema";
import { ActionError, defineAction } from "astro:actions";

import { dbService } from "$lib/server/services/database.ts";
import { auth } from "$lib/server/services/auth.ts";
import { catchErrorTyped } from "$lib/utils/index.ts";

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

  visits: defineAction({
    input: z.object({ id: z.string() }),

    handler: async (input, context) => {
      const url = new URL(context.request.headers.get("referer")!);
      const content = extractTableAndSlug(url);

      const { error, data: db } = await catchErrorTyped(dbService.getDB());
      if (error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to connect to the database.",
        });
      }

      const { user } = await auth.api.getSession({
        headers: context.request.headers,
      }) || { user: { ...input } };

      { // scoped: user auth
        const { error } = await catchErrorTyped(db.query(
          `
            LET $user = type::record($userId);
            LET $page = SELECT VALUE id FROM ONLY type::table($table) WHERE slug = $slug LIMIT 1;
            RELATE $user -> visits -> $page CONTENT { created: time::now() };
          `,
          { ...content, userId: user.id },
        ));

        if (error) {
          console.error("Error recording visit:", error);

          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
      }
    },
  }),
};

function extractTableAndSlug(url: URL) {
  const pathnameParts = url.pathname.split("/").filter(Boolean);
  let table;
  let slug;

  const contentIndex = pathnameParts.indexOf("content");

  if (contentIndex !== -1 && pathnameParts.length > contentIndex + 1) {
    table = pathnameParts[contentIndex + 1];
  }

  if (url.search) {
    // Slug is in the search parameters
    const searchParams = new URLSearchParams(url.search);

    slug = searchParams.get("slug");
  } else if (pathnameParts.length > contentIndex + 2) {
    // Slug is the last part of the pathname
    slug = pathnameParts[pathnameParts.length - 1];
  }

  return { table, slug };
}
