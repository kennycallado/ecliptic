// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import purgecss from "astro-purgecss";

import { BASE, SITE } from "./src/lib/consts.ts";

// https://astro.build/config
export default defineConfig({
  server: { port: 3000 },
  devToolbar: { enabled: false },

  site: SITE,
  base: BASE,

  integrations: [
    sitemap(),
    purgecss({
      safelist: {
        standard: [/^jodit/, /article-video/],
        greedy: [/*astro*/],
      },
    }),
  ],

  adapter: undefined,

  vite: {
    esbuild: {
      target: "es2021",
    },

    server: {
      proxy: {
        "/otel": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
      },
      cors: false,
    },
  },
});
