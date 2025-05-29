import { dbService } from "$lib/server/services/database.ts";
import { sendNotification } from "$lib/server/services/push.ts";
import { catchErrorTyped } from "$lib/utils";

import type { AstroSharedContext as Ctx } from "astro";

export const prerender = false;

export async function GET(_ctx: Ctx): Promise<Response> {
  const url = new URL(_ctx.request.url);

  const { error, data: db } = await catchErrorTyped(dbService.getDB());
  if (error) return new Response(null, { status: 500 });

  const userId = url.searchParams.get("user");
  if (!userId) {
    return new Response("No user provided", { status: 400 });
  }

  type Notify = {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  const [[subscription]]: [[Notify]] = await db.query(
    `SELECT
      notification.endpoint as endpoint,
      encoding::base64::encode(notification.keys.p256dh) as keys.p256dh,
      encoding::base64::encode(notification.keys.auth) as keys.auth
    FROM ${userId}`,
  );

  if (!subscription || !subscription.endpoint) {
    return new Response("No notification subscription found", { status: 404 });
  }

  const payload = JSON.stringify({
    title: "Test notification",
    body: "This is a test notification",
    icon: "/apple-touch-icon-180x180.png",
  });

  {
    const { error } = await catchErrorTyped(
      sendNotification(subscription, payload),
    );
    if (error) {
      return new Response("Error sending push notification", { status: 500 });
    } else return new Response(null, { status: 200 });
  }
}
