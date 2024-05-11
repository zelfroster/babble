import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "./src/api/"),
      "@components": path.resolve(__dirname, "./src/components/"),
      "@contexts": path.resolve(__dirname, "./src/contexts/"),
    },
  },
});
