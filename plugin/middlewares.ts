import express, { Express } from 'express'
import fs from 'fs'
import jsonServer from 'json-server'
import path from 'path'
import svgtofont from 'svgtofont'
import archiver from 'archiver'
import { generateSvgCahes, archiverLogger } from './utils'
import { setHtmlStrTagAttr } from '@tuimao/core'
import multer from 'multer'
import { nanoid } from 'nanoid'
const utils = require('nodejs-fs-utils')

interface FontOption {
  value: string
  key: string
  group: number
}

interface FontsPluginOption {
  path?: string
  fontName?: string
  classNamePrefix?: string
  css?: boolean
  base64?: boolean
}
interface GenerateFontsOption extends FontsPluginOption {
  groups?: (number | string)[]
  target?: string
  outTarget?: string
}

const createTTFBase64FontFace = (base64: string) => {
  return `@font-face { font-family: "iconfont"; src: url('data:font/woff2;charset=utf-8;base64,${base64}') format('truetype'); }`
}

export const fontAdminMiddlewares = (option: FontsPluginOption = {}) => {
  const targetPath = option.path || 'fontsdb'
  const optionPath = `${targetPath}/index.json`
  const app = express() as Express & { 
    font: {
      generateFonts: typeof generateFonts;
      targetPath: string;
      optionPath: string;
    } 
  }

  // 判断路径是否存在 / 符合创建环境
  if (!fs.existsSync(optionPath)) {
    utils.mkdirsSync(targetPath)
    fs.writeFileSync(optionPath, '{}', { flag: 'w' })
  }

  const jsonRouter = jsonServer.router(optionPath)
  jsonRouter.db.defaults({ group: [], fonts: [] }).write()

  // 配置静态资源访问
  app.use('/fonts', express.static(path.resolve(__dirname, 'public')))
  // 配置 josn-server 服务
  app.use('/json', jsonRouter)

  // 生成所有配置
  const generateFonts = async (defaultOption: GenerateFontsOption = {}) => {
    const {
      target = targetPath,
      base64,
      css,
      groups,
      classNamePrefix,
      outTarget
    } = { ...option, ...defaultOption }
    const generateTarget = path.join(target, '/fonts')
    // Get fonts
    const allFonts: FontOption[] = jsonRouter.db.get('fonts').value()
    const fonts = allFonts.filter((f) => {
      return typeof groups === 'undefined' || groups.some((v) => v == f.group)
    })
    if (!fonts.length) return Promise.reject()

    // Generate Fonts
    await generateSvgCahes(fonts)
    await svgtofont({
      src: path.resolve(__dirname, './caches'),
      dist: generateTarget,
      classNamePrefix,
      css: typeof css === 'undefined' || css
    })

    // Generate Types
    const typeKeys = fonts
      .map((v) => `'${v.key}'`)
      .join(' | ')
      .trim()
    fs.writeFileSync(
      path.resolve(generateTarget, 'iconfont.key.ts'),
      `export type IconfontKey = ${typeKeys || 'string'}`
    )

    // Generate Json
    const json = fonts.reduce<Record<string, string>>((total, value) => {
      total[value.key] = value.value
      return total
    }, {})
    fs.writeFileSync(path.resolve(generateTarget, 'iconfont.json'), JSON.stringify(json, null, '\t'))

    // Generate Base64
    if (base64) {
      const ttfBase64 = fs.readFileSync(path.resolve(generateTarget, 'iconfont.ttf'), 'base64')
      const cssFile = fs.readFileSync(path.resolve(generateTarget, 'iconfont.css'), 'utf-8')
      const base64Css = cssFile.replace(
        /@font-face \{([\s\S]*)\*\/\n\}/,
        createTTFBase64FontFace(ttfBase64)
      )
      fs.writeFileSync(path.resolve(generateTarget, 'iconfont.base64.css'), base64Css)
    }

    // Generate Zip
    if (outTarget) {
      utils.mkdirsSync(outTarget)
      const zipPath = path.resolve(outTarget, './iconfont.zip')
      const output = fs.createWriteStream(zipPath)
      const archive = archiver('zip', {
        zlib: { level: 9 }
      })
      archiverLogger(output, archive)
      archive.directory(target, false)
      archive.pipe(output)
      await archive.finalize()
      return new Promise<string>((r) => output.on('close', () => r(zipPath)))
    }
  }

  // 导出 Fonts
  app.get('/out-fonts', async (req, res) => {
    const groups = req.query.ids as string[]
    const classNamePrefix: string = req.query.prefix as string
    try {
      const zipPath = await generateFonts({
        groups,
        classNamePrefix,
        outTarget: path.resolve(__dirname, 'compress'),
        css: true,
        base64: true
      })
      res.sendFile(zipPath!)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  // 配置上传, 导入多个 svg
  const svgUpload = multer({
    fileFilter: (req, file, callback) => {
      const ext = path.extname(file.originalname)
      callback(null, ext === '.svg')
    }
  })

  // 上传 svg
  app.post('/upload-svgs', svgUpload.array('files', 20), async (req, res) => {
    const files = req.files as Express.Multer.File[]
    const group = JSON.parse(req.body.group)
    const isRetainColor = JSON.parse(req.body.isRetainColor)
    files
      .map((v) => ({
        id: nanoid(10),
        key: v.originalname.split('.')[0],
        value: v.buffer.toString(),
        group
      }))
      .map((v) => {
        if (!isRetainColor) {
          v.value = setHtmlStrTagAttr(v.value,{ tag: ['path','svg'],attr: 'fill', value: 'currentColor'})
        }
        return v
      })
      .reduce((total, value) => total.push(value), jsonRouter.db.get('fonts') as any)
      .write()
    res.send('导出成功!')
  })

  app.font = {
    generateFonts,
    targetPath,
    optionPath
  }
  return app
}
