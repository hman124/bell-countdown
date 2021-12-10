import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    outDir: "./build"
  },
  server: {
    strictPort: true,
    hmr: false
  }
});