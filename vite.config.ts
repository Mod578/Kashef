import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cwd } from 'process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // FIX: Use `cwd()` from the 'process' module to resolve TypeScript error "Property 'cwd' does not exist on type 'Process'".
  const env = loadEnv(mode, cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This makes environment variables available on the client-side `process.env` object.
      // It prioritizes the VITE_GEMINI_API_KEY for local development (as instructed in README.md)
      // and falls back to API_KEY for production/deployment environments.
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.API_KEY)
    }
  }
})
