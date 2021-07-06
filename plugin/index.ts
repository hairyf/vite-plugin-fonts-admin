import { fontAdminMiddlewares } from './middlewares'
import { Plugin } from 'vite'
import { debounce } from 'lodash'
import fs from 'fs'
import path from 'path'
export * from './middlewares'
const utils = require('nodejs-fs-utils')

interface FontsPluginOption {
  path?: string
  fontName?: string
  classNamePrefix?: string
  css?: boolean
  base64?: boolean
}

export const ViteFontsAdmin = (option?: FontsPluginOption) => {
  let watcher: fs.FSWatcher
  const pluginOption: Plugin = {
    name: 'vite-fonts-admin',
    configureServer: (server) => {
      const app = fontAdminMiddlewares(option)
      server.middlewares.use(app)
      const targetPath = option?.path || 'src/VSvg'
      const optionPath = `${targetPath}/index.json`
      // 判断路径是否存在 / 符合创建环境
      if (!fs.existsSync(optionPath)) {
        utils.mkdirsSync(targetPath)
        fs.writeFileSync(optionPath, '{}', { flag: 'w' })
      }
      const generateFonts = debounce(
        () => app.generateFonts({ target: path.resolve(targetPath, './fonts') }),
        50
      )
      watcher = fs.watch(optionPath, generateFonts)
    },
    buildEnd: () => watcher?.close?.()
  }
  return pluginOption
}
