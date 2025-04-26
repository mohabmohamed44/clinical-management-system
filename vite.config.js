import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression';
import cssnano from 'cssnano';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({
      algorithm: 'brotliCompress', // or 'gzip'
      ext: '.br',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/Components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/Pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    }
  },
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