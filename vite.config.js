import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression';
import cssnano from 'cssnano';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({
      algorithm: 'brotliCompress', // or 'gzip'
      ext: '.br',
    }),
  ],
  css: {
    postcss: {
      plugins: [
        cssnano({
          preset: 'default',
        })
      ]
    }
  },
  build: {
    minify: 'terser', // or 'esbuild' for faster minification
    cssMinify: 'esbuild', // Use esbuild for CSS minification
    terserOptions: {
      compress: {
        drop_console: true,
        pure_funcs: ['console.info', 'console.debug'],
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ["react-helmet-async"],
    esbuildOptions: {
      minify: true
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
  }
})