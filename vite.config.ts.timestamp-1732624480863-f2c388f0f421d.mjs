// vite.config.ts
import { vitePlugin as remix } from "file:///C:/Users/zakii/Documents/Sigma%20Block%20Project/remix-stock-management-systems/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///C:/Users/zakii/Documents/Sigma%20Block%20Project/remix-stock-management-systems/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///C:/Users/zakii/Documents/Sigma%20Block%20Project/remix-stock-management-systems/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  server: {
    port: 3e3
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true
      }
    }),
    tsconfigPaths()
  ],
  logLevel: "info",
  ssr: {
    noExternal: [
      "@mui/*",
      "material-react-table",
      "@remix-run/dev",
      "@remix-run/react"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx6YWtpaVxcXFxEb2N1bWVudHNcXFxcU2lnbWEgQmxvY2sgUHJvamVjdFxcXFxyZW1peC1zdG9jay1tYW5hZ2VtZW50LXN5c3RlbXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHpha2lpXFxcXERvY3VtZW50c1xcXFxTaWdtYSBCbG9jayBQcm9qZWN0XFxcXHJlbWl4LXN0b2NrLW1hbmFnZW1lbnQtc3lzdGVtc1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvemFraWkvRG9jdW1lbnRzL1NpZ21hJTIwQmxvY2slMjBQcm9qZWN0L3JlbWl4LXN0b2NrLW1hbmFnZW1lbnQtc3lzdGVtcy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IHZpdGVQbHVnaW4gYXMgcmVtaXggfSBmcm9tIFwiQHJlbWl4LXJ1bi9kZXZcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcIkByZW1peC1ydW4vbm9kZVwiIHtcbiAgaW50ZXJmYWNlIEZ1dHVyZSB7XG4gICAgdjNfc2luZ2xlRmV0Y2g6IHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVtaXgoe1xuICAgICAgZnV0dXJlOiB7XG4gICAgICAgIHYzX2ZldGNoZXJQZXJzaXN0OiB0cnVlLFxuICAgICAgICB2M19yZWxhdGl2ZVNwbGF0UGF0aDogdHJ1ZSxcbiAgICAgICAgdjNfdGhyb3dBYm9ydFJlYXNvbjogdHJ1ZSxcbiAgICAgICAgdjNfc2luZ2xlRmV0Y2g6IHRydWUsXG4gICAgICAgIHYzX2xhenlSb3V0ZURpc2NvdmVyeTogdHJ1ZVxuICAgICAgfVxuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKVxuICBdLFxuICBsb2dMZXZlbDogXCJpbmZvXCIsXG4gIHNzcjoge1xuICAgIG5vRXh0ZXJuYWw6IFtcbiAgICAgIFwiQG11aS8qXCIsXG4gICAgICBcIm1hdGVyaWFsLXJlYWN0LXRhYmxlXCIsXG4gICAgICBcIkByZW1peC1ydW4vZGV2XCIsXG4gICAgICBcIkByZW1peC1ydW4vcmVhY3RcIlxuICAgIF1cbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1hLFNBQVMsY0FBYyxhQUFhO0FBQ3ZjLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBUTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixRQUFRO0FBQUEsUUFDTixtQkFBbUI7QUFBQSxRQUNuQixzQkFBc0I7QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxRQUNyQixnQkFBZ0I7QUFBQSxRQUNoQix1QkFBdUI7QUFBQSxNQUN6QjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxVQUFVO0FBQUEsRUFDVixLQUFLO0FBQUEsSUFDSCxZQUFZO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
