// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { collections, journalPosts, products } from "./src/data/catalog";

const staticPages = [
  "/",
  "/shop",
  "/suits",
  "/collections",
  "/heritage",
  "/craft",
  "/journal",
  "/contact",
  "/account",
  "/wishlist",
  "/bag",
  "/checkout",
  ...collections.map((collection) => `/collections/${collection.slug}`),
  ...products.map((product) => `/product/${product.slug}`),
  ...journalPosts.map((post) => `/journal/${post.slug}`),
].map((path) => ({ path }));

export default defineConfig({
  // GitHub Pages serves files only, so emit a complete static storefront.
  nitro: false,
  tanstackStart: {
    server: { entry: "server" },
    pages: staticPages,
    prerender: {
      enabled: true,
      autoStaticPathsDiscovery: false,
      crawlLinks: false,
      failOnError: true,
    },
    sitemap: {
      enabled: true,
      host: "https://kotadoriasarees.shop",
    },
  },
});
