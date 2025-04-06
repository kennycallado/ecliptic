import type { AstroSharedContext } from "astro";

export function GET({ request }: AstroSharedContext) {
  return new Response(JSON.stringify({ hello: "world" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const prerender = false;
