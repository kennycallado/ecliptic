import webpush from "web-push";
import { db } from "$lib/server/services/database.ts";

import type { AstroSharedContext as Ctx } from "astro";

const secretVapid = import.meta.env.SECRET_VAPID;
const publicVapid = import.meta.env.PUBLIC_VAPID;

webpush.setVapidDetails(
  "mailto:foo@ipsitec.es",
  publicVapid,
  secretVapid,
);

export const prerender = false;

export async function GET(_ctx: Ctx): Promise<Response> {
  const url = new URL(_ctx.request.url);

  try {
    await db.isReady;
  } catch (e) {
    console.error("Error connecting to database:", e);
    return new Response(null, { status: 500 });
  }

  const userId = url.searchParams.get("user");
  if (!userId) {
    return new Response("No user provided", { status: 400 });
  }

  type Notify = {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  const [[subscription]]: [[Notify]] = await db.db.query(
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

  try {
    await webpush.sendNotification(subscription, payload);
  } catch (e) {
    console.error("Error sending push notification:", e);
    return new Response("Error sending push notification", { status: 500 });
  }

  return new Response(null, { status: 200 });
}
