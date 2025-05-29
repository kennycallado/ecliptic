import type { AstroSharedContext } from "astro";

import { dbService } from "$lib/server/services/database.ts";
import { catchErrorTyped } from "$lib/utils";

export const prerender = false;

export async function GET({ request, params }: AstroSharedContext) {
  const url = new URL(request.url);

  if (url.searchParams.get("database")) {
    const { error: eDB, data: db } = await catchErrorTyped(dbService.getDB());
    if (eDB) return new Response(null, { status: 500 });

    const { error, data } = await catchErrorTyped(db.query("RETURN 'foo'"));
    if (error) {
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500 },
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  }

  return new Response(JSON.stringify({ hello: "world" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
