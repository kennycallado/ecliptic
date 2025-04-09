import { db } from "$lib/server/services/database.ts";
import type { AstroSharedContext } from "astro";

export async function GET({ request, params }: AstroSharedContext) {
  const url = new URL(request.url);

  if (url.searchParams.get("database")) {
    await db.ready;

    let res;
    try {
      res = await db.query("RETURN 'foo'");
    } catch (error) {
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(res), { status: 200 });
  }

  return new Response(JSON.stringify({ hello: "world" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const prerender = false;
