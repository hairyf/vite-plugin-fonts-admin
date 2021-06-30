/*
 * @Author: Mr.Mao
 * @Date: 2021-06-28 15:38:35
 * @LastEditTime: 2021-06-30 20:40:06
 * @Description:
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */

type NaiveUiComponents = typeof import('naive-ui')
declare module 'vue' {
  export interface GlobalComponents extends NaiveUiComponents {}
}
export {}
