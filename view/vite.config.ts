/*
 * @Author: Mr.Mao
 * @Date: 2021-05-17 18:48:39
 * @LastEditTime: 2021-07-02 17:49:00
 * @Description: vite.config.ts
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */

// https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ViteComponents, { NaiveUiResolver } from 'vite-plugin-components'
import { resolve } from 'path'
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/proxy': {
  //       target: 'http://localhost:3001',
  //       rewrite: (path) => path.replace(/^\/proxy/, '')
  //     }
  //   }
  // },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src/components')
    }
  },
  build: {
    outDir: '../package/public'
  },
  plugins: [
    vue(),
    ViteComponents({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      customComponentResolvers: [NaiveUiResolver()]
    }),
    vueJsx()
  ]
})
