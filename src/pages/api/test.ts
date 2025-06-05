import type { AstroSharedContext } from "astro";

import { dbService } from "$lib/server/services/database.ts";
import { catchErrorTyped } from "$lib/utils/index.ts";

export const prerender = false;

export async function GET({ request, params }: AstroSharedContext) {
  const url = new URL(request.url);

  if (url.searchParams.get("database")) {
    const { error: eDB } = await catchErrorTyped(dbService.getDB());
    if (eDB) return new Response(null, { status: 500 });

    if (eDB) {
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({ message: "Database connection successful" }),
      { status: 200 },
    );
  }

  return new Response(JSON.stringify({ hello: "world" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
