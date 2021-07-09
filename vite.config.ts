/*
 * @Author: Mr.Mao
 * @Date: 2021-05-17 18:48:39
 * @LastEditTime: 2021-07-09 17:14:13
 * @Description: vite.config.ts
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */

// https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ViteComponents, { NaiveUiResolver } from 'vite-plugin-components'
import { ViteFontsAdmin } from './plugin'
import { resolve } from 'path'
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src/components')
    }
  },
  base: process.env.NODE_ENV === 'production' ? '/fonts' : '',
  build: {
    outDir: 'package/public'
  },
  plugins: [
    vue(),
    vueJsx(),
    ViteComponents({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      customComponentResolvers: [NaiveUiResolver()]
    }),
    ViteFontsAdmin()
  ]
})
