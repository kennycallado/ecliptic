const pubVapid = import.meta.env.PUBLIC_VAPID;

// document.addEventListener("DOMContentLoaded", reqPermission);

export async function reqPermission() {
  //  Request permission for notifications
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Permission not granted for Notification");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // Replace with your own VAPID public key
      applicationServerKey: pubVapid,
    });

    // Send the subscription to your server
    const response = await fetch("/api/push/?subscribe=1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    console.log("Subscription response:", response.status);

    console.log("User is subscribed:", subscription);
  } catch (err) {
    console.log("Failed to subscribe the user: ", err);
  }

  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("Received a message from service worker:", event.data);
  });
}
