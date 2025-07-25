import { RecordId } from "surrealdb";
import { defineCollection, z } from "astro:content";

import { dbService } from "$lib/server/services/database.ts";
import { catchErrorTyped } from "$lib/utils/index.ts";

export type Member = {
  id: string | RecordId;
  name: string;
  group: number;
  active: boolean;
  position: string;
  department: string;
  photo: string;
};

export const members = defineCollection({
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

    const query = `SELECT * FROM member ORDER BY group DESC;`;

    const { error, data } = await catchErrorTyped(db.query<Member[][]>(query));
    if (error) console.error("Failed to fetch members:", error);
    if (!data) return [];

    return data[0].map((member) => ({ ...member, id: member.id.toString() }));
  },

  schema: z.object({
    id: z.string().or(z.instanceof(RecordId)),
    name: z.string(),
    group: z.number().min(1).max(3),
    active: z.boolean(),
    position: z.string().min(4),
    department: z.string().min(4),
    photo: z.string(),
  }),
});
