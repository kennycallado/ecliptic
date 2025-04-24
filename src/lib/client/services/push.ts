import { StringRecordId } from "surrealdb";
import { auth } from "$lib/client/services/auth.ts";

const pubVapid = import.meta.env.PUBLIC_VAPID;

export async function reqPermission() {
  const db = auth.getDB();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  //  Request permission for notifications
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Permission not granted for Notification");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription;

  try {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: pubVapid,
    });
  } catch (err) {
    console.log("Failed to subscribe the user: ", err);
  }

  if (!subscription) return;

  try {
    const res = await db.merge(new StringRecordId(user.id), {
      notification: {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.getKey("p256dh"),
          auth: subscription.getKey("auth"),
        },
      },
    });

    console.log("User notification subscription updated:", res);
  } catch (e) {
    console.error("Failed to update user notification subscription", e);
    return;
  }
}

// Listen for messages from the service worker
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("Received a message from service worker:", event.data);
  });
}
