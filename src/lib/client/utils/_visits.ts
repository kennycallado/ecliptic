import { actions } from "astro:actions";
import { auth } from "$lib/client/services/auth.ts";
import { catchErrorTyped } from "$lib/utils/index.ts";

export async function visit() {
  const { error } = await catchErrorTyped(auth.isReady);
  if (error) console.error("Error initializing auth:", error);

  const user = auth.getUser() ?? auth.getGuest();
  actions.visits({ id: user.id!.toString() });
}
