/*
 * @Author: Mr.Mao
 * @Date: 2021-06-29 16:57:51
 * @LastEditTime: 2021-07-02 17:56:38
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
import archiver from 'archiver';
import { generateSvgCahes, archiverLogger } from './utils'
import multer from 'multer'
const utils = require('nodejs-fs-utils')
interface FontsPluginOption {
  dir?: string
  fontName?: string
  classNamePrefix?: string
  css?: boolean
}

/**
 * 开启 ViteFontsPlugin 服务
 * @param option
 * @returns {Plugin}
 */
const ViteFontsPlugin = (option: FontsPluginOption = {}) => {
  const app = express()
  const dirPath = option.dir || 'src/VSvg'
  const pluginHtmlPath = path.join(__dirname, './public/index.html')
  const optionPath = `${dirPath}/index.json`
  const fontsPath = path.resolve(dirPath, 'fonts')
  const cachesPath = path.resolve(__dirname, 'caches')

  // 初始化服务器配置
  const initServerStart = (server: ViteDevServer) => {
    const { host, port } = server.config.server
    axios.defaults['baseURL'] = `http://${host || 'localhost'}:${port}/json`
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
      classNamePrefix: option.classNamePrefix,
      css: typeof option.css === 'undefined' || option.css,
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
    const ids = req.query.ids as string[]
    const prefix: string = req.query.prefix as string
    const groupFonts = await Promise.all(
      ids.map(v => {
        return axios
          .get<fontOption[]>('/fonts', { params: { group: v } })
          .then(v => v.data)
      })
    )
    const fonts = groupFonts.flat(1)
    if (!fonts.length) return res.status(401).send('暂无图标!')
    generateSvgCahes(fonts)
    const distPath = path.resolve(__dirname, 'iconfont')
    const compressPath = path.resolve(__dirname, 'compress/iconfont.zip')
    utils.mkdirsSync(distPath)
    await svgtofont({
      src: cachesPath,
      dist: distPath,
      classNamePrefix: prefix,
      css: true
    });
    const typeKeys = fonts.map(v => `'${v.key}'`).join(' | ').trim()
    fs.writeFileSync(path.resolve(distPath, 'iconfont.key.ts'), `export type IconfontKey = ${typeKeys || 'string'}`)
    // 创建文件流, 压缩打包, 完成归档
    const output = fs.createWriteStream(compressPath)
    const archive = archiver("zip", {
      zlib: { level: 9 }
    })
    archiverLogger(output, archive)
    archive.directory(distPath, false)
    archive.pipe(output)
    archive.finalize()
    output.on('close', () => {
      res.sendFile(compressPath)
    })
  })

  // 配置上传, 导入多个 svg
  const upload = multer({
    fileFilter: (req, file, callback) => {
      const ext = path.extname(file.originalname)
      callback(null, ext === '.svg')
    }
  })

  // 接收上传 svg
  app.post('/upload-svgs', upload.array('files', 20), async (req, res) => {
    const multerFiles = req.files as Express.Multer.File[]
    const group = JSON.parse(req.body.group)
    const isRetainColor = JSON.parse(req.body.isRetainColor)
    await Promise.all(
      multerFiles
        .map(v => ({
          key: v.originalname.split('.')[0],
          value: v.buffer.toString(),
          group
        }))
        .map(v => {
          if (!isRetainColor) {
            v.value = v.value.replace(/fill="(.*)"/g, `fill="${'currentColor'}"`)
          }
          return v
        })
        .map(v => axios.post('/fonts', v))
    )
    res.send('上传完毕!')
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

export default ViteFontsPlugin
