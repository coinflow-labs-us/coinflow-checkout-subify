import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import inject from "@rollup/plugin-inject";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    commonjs(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ["path"],
      // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
      exclude: [
        "http", // Excludes the polyfill for `http` and `node:http`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
      // Override the default polyfills for specific modules.
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        fs: "memfs",
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      plugins: [inject({ Buffer: ["buffer", "Buffer"], process: "process" })],
    },
  },
});
