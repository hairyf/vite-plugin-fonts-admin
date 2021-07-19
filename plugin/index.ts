/*
 * @Author: Mr.Mao
 * @Date: 2021-07-06 09:09:31
 * @LastEditTime: 2021-07-19 20:50:36
 * @Description: 
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
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
      const generateFonts = debounce(
        () => app.font.generateFonts({ target: path.resolve(app.font.optionPath, '/fonts') }),
        50
      )
      watcher = fs.watch(app.font.optionPath, generateFonts)
    },
    buildEnd: () => watcher?.close?.()
  }
  return pluginOption
}
