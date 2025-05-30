import { z } from "astro:schema";
import { ActionError, defineAction } from "astro:actions";

import { auth } from "$lib/server/services/auth.ts";
import { dbService } from "$lib/server/services/database.ts";
import { catchErrorTyped } from "$lib/utils/index.ts";

import { extractTableAndSlug } from "./visits.ts";

export default defineAction({
  input: z.object({ id: z.string() }),

  handler: async (input, context) => {
    const url = new URL(context.request.headers.get("referer")!);
    const content = extractTableAndSlug(url);

    const { error: eDb, data: db } = await catchErrorTyped(dbService.getDB());
    if (eDb) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to connect to the database.",
      });
    }

    const { user } = await auth.api.getSession({
      headers: context.request.headers,
    }) || { user: { ...input } };

    const { error, data } = await catchErrorTyped(db.query(
      `
        LET $user = type::record($userId);
        LET $page = SELECT VALUE id FROM ONLY type::table($table) WHERE slug = $slug LIMIT 1;
        RELATE $user -> likes -> $page;
        SELECT likes FROM type::table($table) WHERE slug = $slug LIMIT 1;
        `,
      { ...content, userId: user.id },
    ));

    if (error) {
      if (error.message.includes("unique_likes")) {
        return {
          success: false,
          error: {
            code: "CONFLICT",
            message: "You have already liked this content.",
          },
        };
      }

      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while processing your request.",
        },
      };
    }

    return { success: true, data: { ...data[3][0] } };
  },
});
