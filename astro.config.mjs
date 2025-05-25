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

  // TODO: not really tested
  // prefetch: { defaultStrategy: "viewport" },
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
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,webp,jpg,jpeg,gif}"],
        importScripts: [`${base}js/workers/push.js`],
        navigateFallbackDenylist: [new RegExp(`^${base}content\\/`)], // TODO: check if can use /content/fallback
        runtimeCaching: [
          {
            urlPattern: new RegExp(`^${base}content\\/`),
            handler: "NetworkFirst",
          },
          {
            // Coincide con las imágenes en /_astro/ y otras extensiones comunes
            urlPattern: ({ request, url }) => {
              if (request.destination !== "image") {
                return false;
              }
              // Puedes ser más específico si quieres, por ejemplo, con url.pathname.startsWith(`${base}_astro/`)
              // o simplemente cachear todas las imágenes
              return /\.(?:png|gif|jpg|jpeg|svg|webp)$/.test(url.pathname);
            },
            // Estrategia común para imágenes: CacheFirst o StaleWhileRevalidate
            handler: "CacheFirst", // Intenta servir desde caché primero, si no, red y cachea.
            options: {
              cacheName: "images-cache", // Un nombre descriptivo para este caché
              expiration: {
                maxEntries: 100, // Máximo número de imágenes a cachear
                maxAgeSeconds: 30 * 24 * 60 * 60, // Cachear por 30 días
              },
              // Opcional: si las imágenes son de dominios cruzados y quieres cachearlas
              // cacheableResponse: {
              //   statuses: [0, 200], // Cachea respuestas opacas (0) y exitosas (200)
              // },
            },
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
