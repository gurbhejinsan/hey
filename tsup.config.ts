import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  format: ["esm", "esm"],
  dts: false,
  minify: true,
  clean: true,
  target: "node18",
  outDir: "dist",
})
