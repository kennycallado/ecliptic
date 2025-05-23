// @ts-check
import { defineConfig } from "astro/config";
import "dotenv/config";

import AstroPWA from "@vite-pwa/astro";
import deno from "@deno/astro-adapter";
import purgecss from "astro-purgecss";
import sitemap from "@astrojs/sitemap";

const base = getFormattedBaseUrl(process.env.BASE_URL);
const site = process.env.SITE_URL || "http://localhost";

// https://astro.build/config
export default defineConfig({
  server: { port: 3000 },
  devToolbar: { enabled: false },

  base,
  site,

  // NOTE: not really tested
  prefetch: { defaultStrategy: "viewport" },
  trailingSlash: "always",

  integrations: [
    sitemap(),
    purgecss({
      safelist: {
        // /text-info/ because of defer
        standard: [/^jodit/, /text-info/],
        greedy: [/*astro*/],
      },
    }),

    AstroPWA({
      mode: "development",
      includeAssets: ["public/favicon.svg"],
      registerType: "autoUpdate",

      manifest: {
        id: base,
        name: "Ecliptic PWA",
        short_name: "Eclip",
        theme_color: "#613583",

        icons: [
          {
            src: base + "favicon.svg",
            sizes: "150x150",
            type: "image/svg+xml",
          },
        ],
      },

      pwaAssets: {
        config: true,
      },

      workbox: {
        navigateFallback: base,
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
        importScripts: [`${base}js/workers/push.js`],
        navigateFallbackDenylist: [new RegExp(`^${base}content\\/`)], // TODO: check if can use /content/fallback
        runtimeCaching: [
          {
            urlPattern: new RegExp(`^${base}content\\/`),
            handler: "NetworkOnly", // avoid caching
          },
        ],
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

  // NOTE: because of astro actions
  security: { checkOrigin: false },

  adapter: deno({
    start: process.env.PREV === "true" ? true : false,
    port: 3000,
  }),

  vite: {
    esbuild: {
      target: "es2021",
    },

    server: {
      proxy: {
        "/otel": {
          target: "http://localhost:8000" + base,
          changeOrigin: true,
          secure: false,
        },
      },
      cors: false,
    },
  },
});

/**
 * @param {string | undefined} envBaseUrl
 * @returns {string} */
function getFormattedBaseUrl(envBaseUrl) {
  let rawBase = envBaseUrl || "";
  rawBase = rawBase.replace(/\/\/+/g, "/");

  if (rawBase && rawBase !== "/" && !rawBase.startsWith("/")) {
    rawBase = `/${rawBase}`;
  }

  if (rawBase && rawBase !== "/" && !rawBase.endsWith("/")) {
    rawBase = `${rawBase}/`;
  }

  if (rawBase === "" || rawBase === "//" || !rawBase.startsWith("/")) {
    return "/";
  }

  return rawBase;
}
