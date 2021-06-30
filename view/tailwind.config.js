/*
 * @Author: Mr.Mao
 * @Date: 2021-06-30 20:34:23
 * @LastEditTime: 2021-06-30 22:34:47
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
const tailwindConfigPreset = require('@tuimao/tailwind-config-preset').default
module.exports = {
  presets: [
    tailwindConfigPreset({
      theme: { colors: { primary: 'var(--primary-color)' } }
    })
  ]
}
