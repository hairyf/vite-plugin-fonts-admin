import express from 'express'
import { fontAdminMiddlewares } from './middlewares'

const app = express()
app.use(fontAdminMiddlewares({ path: 'fontsdb' }))

let port = 3000
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
