import { defineCollection, z } from "astro:content";

import { db as dbSvc } from "$lib/server/services/database.ts";
import { catchErrorTyped } from "$lib/utils.ts";

export const posts = defineCollection({
  loader: async () => {
    const db = dbSvc.db;

    { // scoped: db ready
      const { error } = await catchErrorTyped(db.ready);
      if (error) {
        console.error("Database not ready:", error);
      }
    }

    const query =
      "SELECT *,meta::tb(id) as table FROM post WHERE !draft AND publish < time::now() ORDER BY publish DESC;";

    const { error, data } = await catchErrorTyped(db.query<object[][]>(query));
    if (error) {
      console.error("Failed to fetch posts:", error);
    }

    if (!data) return [];

    return data[0].map((post) => ({
      ...post,
      id: post.id.toString(),
    }));
  },

  schema: z.object({
    id: z.string(),
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
