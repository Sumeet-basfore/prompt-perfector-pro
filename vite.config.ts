import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-radix": [
            "@radix-ui/react-select",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-toast",
          ],
          "vendor-ui": ["lucide-react", "class-variance-authority", "clsx", "tailwind-merge"],
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && viteCompression(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
