import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import Router from 'koa-router'
import mongoose from 'mongoose'
import fs from 'fs'
import { resolve } from 'path'
import R from 'ramda'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import config from './config'
import wechatMiddle from './wechat/middleware'
import reply from './wechat/reply'

const router = new Router()
const models = resolve(__dirname, './database/schema')
const sessionConfig = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  signed: true,
  rolling: false
}
const formatData = R.map(i => {
  i._id = i.nmId
  return i
})

// 同步读取文件
fs.readdirSync(models).forEach(file => {
  // console.log(file)
  return require(resolve(__dirname, `./database/schema/${file}`))
})

let wikiCharacters = require(resolve(
  __dirname,
  './database/json/completeCharacters.json'
))
let wikiHouses = require(resolve(
  __dirname,
  './database/json/completeHouses.json'
))
wikiCharacters = formatData(wikiCharacters)

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
mongoose.connection.on('open', async () => {
  console.log('数据库链接成功：', config.db)
  const WikiHouse = mongoose.model('WikiHouse')
  const WikiCharacter = mongoose.model('WikiCharacter')
  const User = mongoose.model('User')

  const existWikiHouses = await WikiHouse.find({}).exec()
  const existWikiCharacters = await WikiCharacter.find({}).exec()

  if (!existWikiHouses.length) WikiHouse.insertMany(wikiHouses)
  if (!existWikiCharacters.length) WikiCharacter.insertMany(wikiCharacters)

  let user = await User.findOne({
    email: 'admin@qq.com'
  }).exec()
  // 初始化管理员数据
  if (!user) {
    console.log('写入管理员数据')
    user = new User({
      email: 'admin@qq.com',
      password: 'admin',
      role: 'admin'
    })

    await user.save()
  }
})

let wechat = require('./controllers/wechat')
let wiki = require('./controllers/wiki')
let product = require('./controllers/product')
let admin = require('./controllers/admin')

router.all('/wechat-hear', wechatMiddle(config.wechat, reply))
/* router.get('/wechat', async (ctx, next) => {
  let mp = require('./wechat/index.js')
  let menu = require('./wechat/menu.js').default
  let client = mp.getWechat()
  let data = await client.handle('createMenu', menu)
  console.log(data)
}) */

/**
 * wechat api
 */
// 客户端发起了js sdk调用
router.get('/wechat-signature', wechat.signature)

// 发起登录请求  http://ngrok.86886.wang/wechat-redirect?visit=1&id=2
// 用户同意登录后，后端会执行重定向到http://ngrok.86886.wang/oauth
router.get('/wechat-redirect', wechat.redirect)

// 前端向wechat-oauth发送请求，拿到用户信息
router.get('/wechat-oauth', wechat.oauth)

/**
 * wiki api
 */
router.get('/wiki/houses', wiki.getHouses)
router.get('/wiki/characters', wiki.getCharacters)
router.get('/wiki/house/:_id', wiki.getHouse)
router.get('/wiki/character/:_id', wiki.getCharacter)

/**
 * product api
 */
router.get('/shop/products', product.getProducts)
router.get('/shop/product/:_id', product.getProduct)
router.post('/shop/product', product.postProduct)
router.patch('/shop/product', product.patchProduct)
router.del('/shop/product/:_id', product.delProduct)

/**
 * login logout
 */
router.post('/admin/login', admin.login)
router.post('/admin/logout', admin.logout)

async function start () {
  const app = new Koa()
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3006
  app.keys = ['gzh']
  app.use(bodyParser())
  app.use(session(sessionConfig, app))
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
    ctx.req.session = ctx.session
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
