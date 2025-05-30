import { actions } from "astro:actions";

import { auth } from "$lib/client/services/auth.ts";
import { catchErrorTyped } from "$lib/utils/index.ts";

export async function like() {
  const { error: eReady } = await catchErrorTyped(auth.isReady);
  if (eReady) {
    console.error("Error initializing auth:", eReady);
    return;
  }

  const user = auth.getUser() ?? auth.getGuest();
  const { error, data } = await actions.likes({ id: user.id!.toString() });

  // throw
  if (error) return;

  if (!data.success) {
    if (data.error?.code === "CONFLICT") {
      alert("You have already liked this content.");
      return;
    }

    console.error("Error liking content:", data.error);
    return;
  }

  return data.data!.likes;
}
