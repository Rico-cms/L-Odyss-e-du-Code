import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'L-Odyss-e-du-Code';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
})
