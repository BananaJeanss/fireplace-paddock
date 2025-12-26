import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    mkcert(),
    VitePWA({
      manifest: {
        name: "Fireplace Paddock",
        short_name: "Fireplace Paddock",
        description: "A cozy fireplace with F1 quotes, and christmas music.",
        theme_color: "#000000",
        icons: [
          {
            src: "icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "icons/*"],
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "video" ||
              request.destination === "audio",
            handler: "CacheFirst",
            options: {
              cacheName: "media-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
