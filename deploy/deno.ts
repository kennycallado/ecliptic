import { handle } from "../dist/server/entry.mjs";
import { queueing } from "./scripts/queue.ts";

const kv = await Deno.openKv();

{ // scoped: queue
  const { error } = await queueing(kv);
  if (error) {
    console.error("Error in queueing:", error);
  }
}

export default {
  fetch(req: Request): Promise<Response> {
    return handle(req);
  },
};
