import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = resolve(__dirname, '../config.json')
const normalizedConfigPath = normalizePath(configPath)

function appConfigPlugin() {
  const virtualId = 'virtual:app-config'
  const resolvedId = '\0' + virtualId
  return {
    name: 'app-config',
    resolveId(id) {
      if (id === virtualId) return resolvedId
    },
    load(id) {
      if (id !== resolvedId) return
      this.addWatchFile(configPath)
      const config = JSON.parse(readFileSync(configPath, 'utf-8'))
      return `export default ${JSON.stringify(config)}`
    },
    handleHotUpdate({ file, server }) {
      if (normalizePath(file) !== normalizedConfigPath) return
      const configModule = server.moduleGraph.getModuleById(resolvedId)
      if (configModule) server.moduleGraph.invalidateModule(configModule)
      server.ws.send({ type: 'full-reload', path: '*' })
      return []
    }
  }
}

export default defineConfig({
  plugins: [vue(), appConfigPlugin()]
})
