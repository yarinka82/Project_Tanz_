import { defineConfig } from "vite";
import { glob } from "glob";
import injectHTML from "vite-plugin-html-inject";
import FullReload from "vite-plugin-full-reload";
import SortCss from "postcss-sort-media-queries";

const ROUTES = [

  { match: ["/"], file: "/index.html" },

  { match: ["/impressum"], file: "/impressum.html" },

  { match: ["/datenschutz"], file: "/datenschutz.html" },

  { match: ["/contact"], file: "/contact.html" },

  { match: ["/about"], file: "/about.html" },

  { match: ["/kurse"], file: "/kurse.html" },

  { match: ["/gallery"], file: "/gallery.html" },

];

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === "serve" ? "global" : "_global"]: {},
    },
    root: ".",
    server: {
    watch: {
      ignored: ['**/DumpStack.log.tmp']
    }
  },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync("./*.html"),
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === "commonHelpers") {
              return "commonHelpers.js";
            }
            return "[name].js";
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".html")) {
              return "[name].[ext]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
      },
      outDir: "./src/dist",
      emptyOutDir: true,
    },
    plugins: [
      injectHTML(),
      FullReload(["./*.html"]),
      SortCss({
        sort: "mobile-first",
      }),
      {
        name: "spa-fallback",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (!req.url) return next();
            const pathname = req.url.split("?")[0].replace(/\/$/, "") || "/";

            const staticRoute = ROUTES.find((r) => r.match.includes(pathname));
            if (staticRoute) {
              req.url = staticRoute.file;
              return next();
            }
            return next();
          }
          )
        }
      }
    ],
  };
});
