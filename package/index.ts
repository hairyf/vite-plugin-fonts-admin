/*
 * @Author: Mr.Mao
 * @Date: 2021-06-29 16:57:51
 * @LastEditTime: 2021-07-01 18:16:09
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import express from 'express'
import jsonServer from 'json-server'
import path from 'path'
import fs from 'fs'
import { Plugin } from 'vite'
import svgtofont from 'svgtofont'
import { debounce } from 'lodash'
const utils = require('nodejs-fs-utils')
import { generateSvgCahes } from './utils'
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
  // 判断路径是否存在 / 符合创建环境
  try {
    fs.readFileSync(optionPath)
  } catch (error) {
    utils.mkdirsSync(dirPath)
    fs.writeFileSync(optionPath, '{ "group": [], "fonts": [] }', { flag: 'w' })
  }

  // 进行同步 fonts 配置
  const syncSvgToFonts = debounce(async () => {
    const { svgs } = JSON.parse(fs.readFileSync(optionPath, 'utf-8'))
    if (!Object.keys(svgs).length) {
      return utils.emptyDirSync(fontsPath)
    }
    generateSvgCahes(svgs)
    await svgtofont({
      src: path.resolve(__dirname, './caches'),
      dist: fontsPath,
      fontName: option.fontName || 'svgtofont',
      css: true
    })
  }, 100)

  // 假如 fonts 为空, 同步 fonts
  if (!fs.existsSync(fontsPath)) {
    utils.mkdirsSync(fontsPath)
    syncSvgToFonts()
  }

  // 配置视图文件, 模板引擎, 渲染页面
  app.get('/fonts', (req, res) => {
    res.send(fs.readFileSync(pluginHtmlPath, 'utf8'))
  })
  // 配置 josn-server 服务
  app.use('/json', jsonServer.router(optionPath))
  app.use('/json-default', jsonServer.defaults())

  // 监听配置变化, 同步 fonts
  fs.watch(optionPath, syncSvgToFonts)

  const result: Plugin = {
    name: 'vite-plugin-svgs',
    configureServer: (server) => {
      server.middlewares.use(app)
    }
  }
  return result
}

export default VitefontsPlugins
