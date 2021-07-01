/*
 * @Author: Mr.Mao
 * @Date: 2021-06-29 16:57:51
 * @LastEditTime: 2021-07-02 00:59:17
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import express from 'express'
import jsonServer from 'json-server'
import path from 'path'
import fs from 'fs'
import { Plugin, ViteDevServer } from 'vite'
import svgtofont from 'svgtofont'
import { debounce } from 'lodash'
import axios from 'axios'
import { generateSvgCahes } from './utils'
const utils = require('nodejs-fs-utils')

/**
 * 开启 VitefontsPlugins 服务
 * @param option
 * @returns {Plugin}
 */
const VitefontsPlugins = (option: { dir?: string; fontName?: string } = {}) => {
  const app = express()
  const dirPath = option.dir || 'src/VSvg'
  const pluginHtmlPath = path.join(__dirname, './index.html')
  const optionPath = `${dirPath}/index.json`
  const fontsPath = path.resolve(dirPath, 'fonts')
  const cachesPath = path.resolve(__dirname, 'caches')

  // 初始化服务器配置
  const initServerStart = (server: ViteDevServer) => {
    const { host, port } = server.config.server
    axios.defaults['baseURL'] = `http://${host}:${port}/json`
    // 假如 fonts 为空, 同步 fonts
    if (!fs.existsSync(fontsPath)) {
      utils.mkdirsSync(fontsPath)
      utils.mkdirsSync(cachesPath)
      syncSvgToFonts()
    }
  }

  // 判断路径是否存在 / 符合创建环境
  try {
    fs.readFileSync(optionPath)
  } catch (error) {
    utils.mkdirsSync(dirPath)
    fs.writeFileSync(optionPath, '{ "group": [], "fonts": [] }', { flag: 'w' })
  }

  // 进行同步 fonts 配置
  const syncSvgToFonts = debounce(async () => {
    const { data: fonts } = await axios.get<fontOption[]>('/fonts')
    if (!fonts.length) return undefined
    generateSvgCahes(fonts)
    await svgtofont({
      src: path.resolve(__dirname, './caches'),
      dist: fontsPath,
      fontName: option.fontName,
      classNamePrefix: '_placeholder_',
      css: true,
    });
  }, 100)

  // 配置视图文件, 模板引擎, 渲染页面
  app.get('/fonts', (req, res) => {
    res.send(fs.readFileSync(pluginHtmlPath, 'utf8'))
  })
  // 配置 josn-server 服务
  app.use('/json', jsonServer.router(optionPath))
  app.use('/json-default', jsonServer.defaults())

  // 导出 Fonts
  app.get('/out-fonts', async (req, res) => {
    const keys = req.query.keys as string[]
    const prefix: string = req.query.prefix as string
    const groupFonts = await Promise.all(
      keys.map(v => {
        return axios
          .get<fontOption[]>('/fonts', { params: { group: v } })
          .then(v => v.data)
      })
    )
    const fonts = groupFonts.flat(1)
    if (!fonts.length) return undefined
    generateSvgCahes(fonts)
    const distPath = path.resolve(__dirname, 'dist')
    utils.mkdirsSync(distPath)
    utils.emptyDirSync(distPath)
    await svgtofont({
      src: cachesPath,
      dist: distPath,
      classNamePrefix: prefix,
      css: true
    });
    const typeKeys = fonts.map(v => `'${v.key}'`).join(' | ').trim()
    fs.writeFileSync(path.resolve(distPath, 'iconfont.key.ts'), `export type IconfontKey = ${typeKeys || 'string'}`)
    res.send('导出成功!')
  })

  // 监听配置变化, 同步 fonts
  fs.watch(optionPath, syncSvgToFonts)

  const result: Plugin = {
    name: 'vite-plugin-svgs',
    configureServer: (server) => {
      server.middlewares.use(app)
      setTimeout(() => initServerStart(server))
    }
  }
  return result
}

export default VitefontsPlugins
