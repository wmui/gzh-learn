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

router.all('/wechat-hear', wechatMiddle(config.wechat, reply))
router.get('/wechat', async (ctx, next) => {
  let mp = require('./wechat/index.js')
  let client = mp.getWechat()

  // 临时视频测试
  // let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../ice.mp4'))
  
  // 永久视频
  /*let data = await client.handle('uploadMaterial', 'video', resolve(__dirname, '../ice.mp4'), {
    type: 'video',
    description: '{"title": "永久视频","introduction": "wmui"}'
  })*/
  /*{ type: 'video',
  description: '{"title": "永久视频","introduction": "wmui"}' }
  { media_id: 'IHkqesLxVBXIN5WhWWbXxTPmLS4ei88lM1R6cGT-UVM' }*/

  // 永久图片
  /*let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../ice.jpeg'), {
    type: 'image'
  })*/
  /*{ type: 'image' }
  { media_id: 'IHkqesLxVBXIN5WhWWbXxZUAd2MRcUoNANWZfQDI37s',
  url: 'http://mmbiz.qpic.cn/mmbiz_jpg/Rs0FIicPCFbvqvDvlK5THBPicV5YoYoRD5y5aoTR7ysStkAZgeAQw9bT9rTrHEhkBQ71gqk2EHTJupceoOSBswVQ/0?wx_fmt=jpeg' }*/

  // 临时图片
  // let data = await client.handle('uploadMaterial', 'image', resolve(__dirname, '../ice.jpeg'))
  
  // 图文测试  { media_id: 'IHkqesLxVBXIN5WhWWbXxY-hdgJDeE--mszBUxA7qHE' }
  /* const news = {
    articles: [{
      "title": '文章标题',
      "thumb_media_id": 'IHkqesLxVBXIN5WhWWbXxZUAd2MRcUoNANWZfQDI37s',
      "author": 'wmui',
      "digest": '文章摘要',
      "show_cover_pic": 1,
      "content": '文章内容',
      "content_source_url": 'https://github.com/wmui'
    }]
  }
  let data = await client.handle('uploadMaterial', 'news', news, {}) */
  console.log(data)
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
