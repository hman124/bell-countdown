import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    outDir: "./build"
  },
  server: {
    strictPort: true,
    hmr: {
      port: 443 // Run the websocket server on the SSL port
    }
  }
});
