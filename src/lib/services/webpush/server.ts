import webpush from "web-push";
import type { PushSubscription, SendResult } from "web-push";

const secretVapid = import.meta.env.SECRET_VAPID;
const publicVapid = import.meta.env.PUBLIC_VAPID;

webpush.setVapidDetails(
  "mailto:foo@ipsitec.es",
  publicVapid,
  secretVapid,
);

export function sedNotification(
  subscription: PushSubscription,
  payload: string,
): Promise<SendResult> {
  return webpush.sendNotification(subscription, payload);
}
