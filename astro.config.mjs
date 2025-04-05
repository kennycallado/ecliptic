// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import purgecss from "astro-purgecss";
import AstroPWA from "@vite-pwa/astro";

import { BASE, SITE } from "./src/lib/consts.ts";

// https://astro.build/config
export default defineConfig({
  server: { port: 3000 },
  devToolbar: { enabled: false },

  site: SITE,
  base: BASE,

  trailingSlash: "always",

  integrations: [
    sitemap(),
    purgecss({
      safelist: {
        standard: [/^jodit/, /article-video/],
        greedy: [/*astro*/],
      },
    }),

    AstroPWA({
      mode: "development",
      includeAssets: ["public/favicon.svg"],
      registerType: "autoUpdate",

      manifest: {
        id: "/",
        name: "Ecliptic PWA",
        short_name: "Eclip",
        theme_color: "#613583",

        icons: [
          {
            src: "/favicon.svg",
            sizes: "150x150",
            type: "image/svg+xml",
          },
        ],
      },

      pwaAssets: {
        config: true,
      },

      workbox: {
        navigateFallback: "/",
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
      },

      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/$/],
      },

      experimental: {
        directoryAndTrailingSlashHandler: true,
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
