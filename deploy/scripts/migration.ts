import Template from "jsr:@deno-library/template";
import { Surreal } from "jsr:@surrealdb/surrealdb";

import { expandGlob } from "jsr:@std/fs";
import { join } from "jsr:@std/path";

const MIGRATIONS_DIR = join(Deno.cwd(), "deploy/database");

const db = new Surreal();
await db.connect(process.env.PUBLIC_DB_ENDPOINT!, {
  namespace: process.env.PUBLIC_PROJECT_SPEC,
  database: process.env.PUBLIC_PROJECT_NAME,
  auth: {
    username: process.env.SURREAL_USER!,
    password: process.env.SURREAL_PASS!,
  },
});

type Result = { error: Error | undefined; data: boolean };
export async function migrating(): Promise<Result> {
  const tpl = new Template();
  const env = Deno.env.toObject();

  await db.ready;

  // Apply .tpl files
  for await (const entry of expandGlob(join(MIGRATIONS_DIR, "**/*.tpl"))) {
    if (!entry.isFile) continue;

    const templateText = await Deno.readTextFile(entry.path);
    const rendered = tpl.render(templateText, env);

    const res = await db.query<unknown[]>(rendered);
    if (!res) {
      return {
        error: new Error(`Failed to apply migration template: ${entry.path}`),
        data: false,
      };
    }

    console.log(`Applied migration template: ${entry.path}`);
  }

  // Apply .surql files
  for await (const entry of expandGlob(join(MIGRATIONS_DIR, "**/*.surql"))) {
    if (!entry.isFile) continue;

    const sql = await Deno.readTextFile(entry.path);
    const res = await db.query<unknown[]>(sql);
    if (!res) {
      return {
        error: new Error(`Failed to apply migration: ${entry.path}`),
        data: false,
      };
    }

    console.log(`Applied migration: ${entry.path}`);
  }

  return { error: undefined, data: true };
}

console.log("Running migrations...");

const { error } = await migrating();
await db.close();

if (error) {
  console.error("Migrations failed:", error);
  throw error;
}

console.log("Migrations completed.");
