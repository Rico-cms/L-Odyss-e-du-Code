import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'L-Odyss-e-du-Code'
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isGithubPages ? `/${repoName}/` : '/',
})
