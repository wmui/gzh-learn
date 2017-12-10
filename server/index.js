import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import Router from 'koa-router'
import sha1 from 'sha1'
import mongoose from 'mongoose'
import fs from 'fs'
import { resolve } from 'path'
import config from './config'

const router = new Router()
const token = config.wechat.token
const models = resolve(__dirname, './database/schema')

// 同步读取文件
fs.readdirSync(models).forEach(file => require(resolve(models, file)))
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

router.get('/wechat-hear', (ctx, next) => {
  // 必须在数据库初始化完成后引入wechat
  require('./wechat')
  const {
    signature,
    nonce,
    timestamp,
    echostr
  } = ctx.query
  const str = [token, timestamp, nonce].sort().join('')
  const sha = sha1(str)
  // console.log(sha === signature)
  if (sha === signature) {
    ctx.body = echostr
  } else {
    ctx.body = 'signature error'
  }
})

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
