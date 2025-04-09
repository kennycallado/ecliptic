import { Surreal } from "surrealdb";
import { DB } from "$lib/server/consts.ts";

export const db = new Surreal();

db
  .connect(DB.url, { auth: { ...DB.config } })
  .catch((e) => {
    console.error("Database connection error:", e);
  });
