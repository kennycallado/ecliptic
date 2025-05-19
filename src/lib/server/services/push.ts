import webpush from "web-push";

import { VAPID } from "$lib/server/consts.ts";
import type { PushSubscription, SendResult } from "web-push";

webpush.setVapidDetails("mailto:foo@ipsitec.es", VAPID.public, VAPID.secret);

export function sendNotification(
  subscription: PushSubscription,
  payload: string,
): Promise<SendResult> {
  return webpush.sendNotification(subscription, payload);
}
