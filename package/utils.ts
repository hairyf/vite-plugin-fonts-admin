/*
 * @Author: Mr.Mao
 * @Date: 2021-06-30 14:22:24
 * @LastEditTime: 2021-07-01 21:20:01
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import path from 'path'
import fs from 'fs'
const utils = require('nodejs-fs-utils')

/**
 * 根据配置生成 SVG 缓存目录
 * @param svgsObject
 */
export const generateSvgCahes = (fonts: fontOption[]) => {
  const dirPath = path.resolve(__dirname, './caches')
  utils.emptyDirSync(dirPath)
  fonts.forEach(({value, key}) => {
    fs.writeFileSync(path.resolve(dirPath, `${key}.svg`), value, { flag: 'w' })
  })
}
