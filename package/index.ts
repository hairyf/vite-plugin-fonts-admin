/*
 * @Author: Mr.Mao
 * @Date: 2021-06-29 16:57:51
 * @LastEditTime: 2021-07-02 22:38:21
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
  base64?: boolean
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
    axios.defaults['baseURL'] = `http://${host || 'localhost'}:${port || 3000}/json`
    // 假如 fonts 为空, 同步 fonts
    if (!fs.existsSync(fontsPath)) {
      utils.mkdirsSync(fontsPath)
      syncSvgToFonts()
    }
    if (!fs.existsSync(cachesPath)) {
      utils.mkdirsSync(cachesPath)
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
    try {
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
      if (option.base64) {
        // 生成 base64
        const ttfBase64 = fs.readFileSync(path.resolve(fontsPath, 'iconfont.ttf'), 'base64')
        const css = fs.readFileSync(path.resolve(fontsPath, 'iconfont.css'), 'utf-8')
        const replaceCss = css.replace(/\@font-face \{([\s\S]*)\*\/\n\}/, `\
@font-face { font-family: "iconfont"; src: url('data:font/woff2;charset=utf-8;base64,${ttfBase64}') format('truetype'); }\
    `
        )
        fs.writeFileSync(path.resolve(fontsPath, 'iconfont.base64.css'), replaceCss)
      }
    } catch (error) {
      console.log('同步失败', error)
    }
  }, 100)

  // 配置静态资源访问
  app.use('/fonts', express.static(path.resolve(__dirname, 'public')))
  // 配置 josn-server 服务
  app.use('/json', jsonServer.router(optionPath))
  app.use('/json-default', jsonServer.defaults())

  // 导出 Fonts
  app.get('/out-fonts', async (req, res) => {
    try {
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
      utils.mkdirsSync(path.resolve(__dirname, 'compress'))
      await svgtofont({
        src: cachesPath,
        dist: distPath,
        classNamePrefix: prefix,
        css: true
      });
      const typeKeys = fonts.map(v => `'${v.key}'`).join(' | ').trim()
      fs.writeFileSync(path.resolve(distPath, 'iconfont.key.ts'), `export type IconfontKey = ${typeKeys || 'string'}`)
      // 生成 base64
      const ttfBase64 = fs.readFileSync(path.resolve(distPath, 'iconfont.ttf'), 'base64')
      const css = fs.readFileSync(path.resolve(distPath, 'iconfont.css'), 'utf-8')
      const replaceCss = css.replace(/\@font-face \{([\s\S]*)\*\/\n\}/, `\
@font-face { font-family: "iconfont"; src: url('data:font/woff2;charset=utf-8;base64,${ttfBase64}') format('truetype'); }\
    `
      )
      fs.writeFileSync(path.resolve(distPath, 'iconfont.base64.css'), replaceCss)
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
    } catch (error) {
      console.log('导出失败', error)
    }
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
    try {
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
              v.value = v.value.replace(/fill="(\w*%?)"/g, `fill="${'currentColor'}"`)
            }
            return v
          })
          .map(v => axios.post('/fonts', v))
      )
    } catch (error) {
      console.log('上传失败', error)
    }
    res.send('上传完毕!')
  })

  // 监听配置变化, 同步 fonts
  const fSWatcher = fs.watch(optionPath, syncSvgToFonts)

  const result: Plugin = {
    name: 'vite-plugin-svgs',
    configureServer: (server) => {
      server.middlewares.use(app)
      setTimeout(() => initServerStart(server))
    },
    buildEnd() {
      fSWatcher.close()
    }
  }
  return result
}

export default ViteFontsPlugin
