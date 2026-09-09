// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "netlify",
    // @lovable.dev/vite-tanstack-config hardcodes dist/server + dist/client as the
    // nitro output regardless of preset, which breaks Netlify's function auto-discovery
    // (it expects .netlify/functions-internal). Override it back to what the netlify
    // preset actually needs.
    output: {
      dir: ".netlify/functions-internal",
      serverDir: ".netlify/functions-internal/server",
      publicDir: "dist",
    },
  },
});
