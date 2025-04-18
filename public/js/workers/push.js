self.addEventListener("push", async (event) => {
  // console.log("Push event received:", event);

  if (event.data) {
    const data = event.data.json();
    const { title, ...rest } = data;

    // Send the push data to the application
    const clients = await self.clients.matchAll();
    clients.forEach((client) => client.postMessage(data));

    // TODO: seems unnecessary
    // await event.waitUntil(
    //   self
    //     .registration
    //     .showNotification(title, { ...rest }),
    // );

    self
      .registration
      .showNotification(title, { ...rest });
  }
});
