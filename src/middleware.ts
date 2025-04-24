import { auth } from "$lib/server/services/auth.ts";
import { defineMiddleware } from "astro:middleware";

export const prerender = false;
export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const url = new URL(request.url);

  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_server-islands")
  ) {
    const isAuth = await auth.api.getSession({
      headers: request.headers,
    });

    if (isAuth) {
      locals.user = isAuth.user;
      locals.session = isAuth.session;
    }
  }

  return next();
});
