import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import type {InlineConfig} from "vitest";
import type{UserConfig} from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test:{
    globals:true,
    setupFiles:['./test/setup.ts']

  },
}  as UserConfig & {
  test: InlineConfig
} )