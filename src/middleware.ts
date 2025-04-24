import { auth } from "$lib/server/services/auth.ts";
import { defineMiddleware } from "astro:middleware";

export const prerender = false;
export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  return next();
});
