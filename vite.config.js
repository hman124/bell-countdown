import { defineConfig } from "vite";

export default defineConfig({
  jsx: "react",
  plugins: [],
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
