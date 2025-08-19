import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  server: {
    host: "localhost",
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
