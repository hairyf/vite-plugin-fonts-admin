/*
 * @Author: Mr.Mao
 * @Date: 2021-07-06 09:09:31
 * @LastEditTime: 2021-07-19 21:36:41
 * @Description: 
 * @LastEditors: Mr.Mao
 * @autograph: 任何一个傻子都能写出让电脑能懂的代码，而只有好的程序员可以写出让人能看懂的代码
 */
import express from 'express'
import { fontAdminMiddlewares } from './middlewares'

const app = express()
app.use(fontAdminMiddlewares({ path: 'fontsdb' }))

let port = 5050
const server = app.listen(port, () => {
  console.log(`服务开启成功! 地址: http://localhost:${port}/fonts`)
})
const onError = (e: Error & { code?: string }) => {
  if (e.code === 'EADDRINUSE') {
    server.removeListener('error', onError)
    server.listen(++port, () => {
      console.log(`端口发生冲突! 端口更换: http://localhost:${port}/fonts`)
    })
  } else {
    server.removeListener('error', onError)
  }
}
server.on('error', onError)
