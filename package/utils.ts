/*
 * @Author: Mr.Mao
 * @Date: 2021-06-30 14:22:24
 * @LastEditTime: 2021-06-30 16:26:52
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { forIn } from 'lodash'
import path from 'path'
import fs from 'fs'
const utils = require('nodejs-fs-utils')

/**
 * 根据配置生成 SVG 缓存目录
 * @param svgsObject
 */
export const generateSvgCahes = (svgsObject: Record<string, string>) => {
  const dirPath = path.resolve(__dirname, './caches')
  utils.emptyDirSync(dirPath)
  forIn(svgsObject, (v, k) => {
    fs.writeFileSync(path.resolve(dirPath, `${k}.svg`), v, { flag: 'w' })
  })
}
