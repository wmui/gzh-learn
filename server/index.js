import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import Router from 'koa-router'
import mongoose from 'mongoose'
import fs from 'fs'
import { resolve } from 'path'
import config from './config'
import wechatMiddle from './wechat/middleware'
import reply from './wechat/reply'
const router = new Router()
const models = resolve(__dirname, './database/schema')

// 同步读取文件
fs.readdirSync(models).forEach((file) => {
  console.log(file)
  return require(resolve(__dirname, `./database/schema/${file}`))
})
// 开启debug
mongoose.set('debug', true)
// 链接数据库
mongoose.connect(config.db)
// 链接中断重新链接
mongoose.connection.on('disconnected', () => {
  mongoose.connect(config.db)
})
// 连接出错
mongoose.connection.on('error', err => {
  console.error(err)
})
// 连接成功
mongoose.connection.on('open', () => {
  console.log('数据库链接成功：', config.db)
})
let wechat = require('./controllers/wechat')
router.all('/wechat-hear', wechatMiddle(config.wechat, reply))
/*router.get('/wechat', async (ctx, next) => {
  let mp = require('./wechat/index.js')
  let menu = require('./wechat/menu.js').default
  let client = mp.getWechat()
  let data = await client.handle('createMenu', menu)
  console.log(data)
})*/

// 客户端发起了js sdk调用
router.get('/wechat-signature', wechat.signature)

// 发起登录请求  http://wmuigzh.free.ngrok.cc/wechat-redirect?visit=1&id=2
router.get('/wechat-redirect', wechat.redirect)

// 用户同意登录后，后端会执行重定向到http://wmuigzh.free.ngrok.cc/oauth
// 前端在此刻向wechat-oauth发送请求，拿到用户信息
router.get('/wechat-oauth', wechat.oauth)
async function start () {
  const app = new Koa()
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3006
  app.use(router.routes())
  app.use(router.allowedMethods())
  let config = require('../nuxt.config.js')
  config.dev = !(app.env === 'production')
  const nuxt = new Nuxt(config)
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  app.use(async (ctx, next) => {
    await next()
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        promise.then(resolve).catch(reject)
      })
    })
  })
  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}

start()
