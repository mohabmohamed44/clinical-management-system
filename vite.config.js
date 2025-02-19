import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression';
import cssnanoPlugin from 'cssnano';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    compression(),
    cssnanoPlugin(),
  ],
  optimizeDeps: {
    include:["react-helmet-async"],
  },
  build:{
    minify: false,
    terserOptions:{
      compress:{
        drop_console: true,
        pure_funcs: ['console.info', 'console.debug'],
      }
    }
  }
})
