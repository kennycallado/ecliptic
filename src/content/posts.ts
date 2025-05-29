import { RecordId } from "surrealdb";
import { defineCollection, z } from "astro:content";

import { dbService } from "$lib/server/services/database.ts";
import { catchErrorTyped } from "$lib/utils/index.ts";

type Post = { id: string | RecordId };

export const posts = defineCollection({
  loader: async () => {
    const {
      error: errorDB,
      data: db,
    } = await catchErrorTyped(dbService.getDB());
    if (errorDB) {
      console.error("Database not ready:", errorDB);
      // throw new Error("Database not ready");
    }

    if (!db) return [];

    const query = `
      SELECT *,meta::tb(id) as table FROM post
      WHERE !draft AND publish < time::now()
      ORDER BY publish DESC;`;

    const { error, data } = await catchErrorTyped(db.query<Post[][]>(query));
    if (error) console.error("Failed to fetch posts:", error);
    if (!data) return [];

    return data[0].map((post) => ({ ...post, id: post.id.toString() }));
  },

  schema: z.object({
    id: z.string().or(z.instanceof(RecordId)),
    content: z.array(z.string()),
    created: z.date(),
    description: z.string().optional(),
    draft: z.boolean(),
    hero: z.string(),
    likes: z.number().optional(),
    publish: z.date(),
    slug: z.string(),
    table: z.string(),
    title: z.string(),
    updated: z.date(),
    visits: z.number().optional(),
  }),
});
