import webpush from "web-push";
import fs from "node:fs";

import { sedNotification } from "$lib/services/webpush/server.ts";
import subscriptions from "$lib/services/db.json" assert { type: "json" };

import type { AstroSharedContext as Ctx } from "astro";

const secretVapid = import.meta.env.SECRET_VAPID;
const publicVapid = import.meta.env.PUBLIC_VAPID;

webpush.setVapidDetails(
  "mailto:foo@ipsitec.es",
  publicVapid,
  secretVapid,
);

export async function GET(_ctx: Ctx): Promise<Response> {
  const payload = JSON.stringify({
    title: "Test notification",
    body: "This is a test notification",
    icon: "/apple-touch-icon-180x180.png",
  });

  try {
    await sedNotification(subscriptions[0], payload);
  } catch (e) {
    console.error("Error sending push notification:", e);
  }

  return new Response(null, { status: 200 });
}

export async function POST({ request }: Ctx): Promise<Response> {
  const url = new URL(request.url);

  if (url.searchParams.get("subscribe")) {
    // guardar en base de datos
    subscriptions[0] = await request.json();

    fs.writeFileSync(
      "src/lib/services/db.json",
      JSON.stringify(subscriptions, null, 2),
    );
  }

  return new Response(null, { status: 200 });
}

export const prerender = false;
