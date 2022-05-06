import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      includeAssets: ["favicon.png"],
      manifest: {
        background_color: "white",
        theme_color: "black",
        description: "Show the bell schedule countdown",
        display: "standalone",
        icons: [
          {
            src: "https://cdn.glitch.com/57d24874-cb67-48cc-824b-0b097a930360%2Ffavicon.ico",
            sizes: "192x192",
          },
          {
            src: "https://cdn.glitch.me/83902b7b-ef91-4e8d-b9e1-502c054170d1%2FUntitled-modified.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "https://cdn.glitch.me/83902b7b-ef91-4e8d-b9e1-502c054170d1%2FIcon-76.png",
            sizes: "76x76",
            type: "image/png",
          },
          {
            src: "https://cdn.glitch.me/83902b7b-ef91-4e8d-b9e1-502c054170d1%2Fimg-1024.png",
            sizes: "1024x1024",
            type: "image/png",
          },
          {
            src: "https://cdn.glitch.me/83902b7b-ef91-4e8d-b9e1-502c054170d1%2FIcon-60%402x.png",
            sizes: "120x120",
            type: "image/png",
          },
        ],
        name: "Bell Countdown",
        short_name: "Bell Countdown",
        start_url: "/index.html?pwa=true",
      },
    }),
  ],
  build: {
    outDir: "./build",
  },
  server: {
    strictPort: true,
    hmr: {
      port: 443,
    },
  },
});
