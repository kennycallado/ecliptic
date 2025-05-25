import { defineCollection, z } from "astro:content";

export const modules = defineCollection({
  loader: async () => {
    return [];
  },
});
