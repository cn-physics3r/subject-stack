import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cfg = JSON.parse(readFileSync(resolve(__dirname, '../config.json'), 'utf-8'))

function appConfigPlugin() {
  const virtualId = 'virtual:app-config'
  const resolvedId = '\0' + virtualId
  return {
    name: 'app-config',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id === resolvedId) return `export default ${JSON.stringify(cfg)}`
    }
  }
}

export default defineConfig({
  plugins: [vue(), appConfigPlugin()]
})