// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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
  ...["aranya", "kshara", "vana", "dhun", "anant"].map((slug) => `/collections/${slug}`),
  ...[
    "aranya-maroon-zari-kota-saree",
    "kshara-ivory-handwoven-saree",
    "reti-sand-check-saree",
    "vana-sage-zari-saree",
    "dhun-charcoal-pallu-saree",
    "gulab-rose-buti-saree",
    "anant-bridal-maroon-gold-saree",
    "sahaj-ivory-gold-edge-saree",
    "sharda-ivory-kota-doria-suit",
    "rajwada-maroon-zari-suit",
    "mitti-terracotta-kota-doria-suit",
  ].map((slug) => `/product/${slug}`),
  ...[
    "what-makes-a-kota-doria-saree",
    "eleven-days-at-the-loom",
    "meet-the-artisans-of-kota",
    "five-ways-to-drape-a-kota",
    "introducing-dhun",
    "dressing-for-the-festive-season",
  ].map((slug) => `/journal/${slug}`),
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
