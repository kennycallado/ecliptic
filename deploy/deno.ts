import { handle } from "../dist/server/entry.mjs";

export default {
  fetch(req: Request): Promise<Response> {
    return handle(req);
  },
};
