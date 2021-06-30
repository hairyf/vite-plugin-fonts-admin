/*
 * @Author: Mr.Mao
 * @Date: 2021-06-28 14:36:00
 * @LastEditTime: 2021-06-30 20:17:44
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import { defineConfig } from 'vite'
import ViteSvgs from './'
// https: from '//vitejs.dev/config/
export default defineConfig({
  plugins: [
    ViteSvgs({
      dir: 'src/components/VSvg'
    })
  ]
})
