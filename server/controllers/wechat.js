import api from '../api'
import config from '../config'
import { getParamsAsync } from '../wechat/pay'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
// import { openidAndSessionKey, WXBizDataCrypt } from '../wechat/user'

export async function signature (ctx, next) {
  let url = ctx.query.url
  if (!url) ctx.throw(404)

  url = decodeURIComponent(url)

  const params = await api.wechat.getSignatureAsync(url)

  ctx.body = {
    success: true,
    data: params
  }
}

export async function redirect (ctx, next) {
  // target是用户同意授权后前端的重定向目标地址
  const target = config.SITE_ROOT_URL + '/oauth'
  const scope = 'snsapi_userinfo'
  const { visit, id } = ctx.query
  const params = id ? `${visit}_${id}` : visit
  // 这个url是授权页 eg:https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx774a3a23bf9750bb&redirect_uri=http%3A%2F%2Fngrokvip.86886.wang%2Foauth&response_type=code&scope=snsapi_userinfo&state=user&uin=MTY4Mzc3MzAxNw%3D%3D&key=5c1d2d8fbb224aa8da52319a6715c479d11a3eb02c8563904927659d1d2dc0e84985de41c4ca2328b886f4e400fcdda5&pass_ticket=eXvuG6TlAf7SQ12aIV8frK3SJC5IjZiPViSd12qrzcJ+eJ5wbKPI3yk8Ox/CdSh9kbI9C7jBYuynEj1GncNF4A==
  const url = api.wechat.getAuthorizeURL(scope, target, params)
  ctx.redirect(url)
  // 用户同意授权后，微信官方会进行重定向 eg：http://ngrok.86886.wang/oauth?code=071UxIyb1tgA9u0RJFxb18NMyb1UxIyJ&state=user
}

export async function oauth (ctx, next) {
  // 解析url地址  http://ngrok.86886.wang/oauth?code=071UxIyb1tgA9u0RJFxb18NMyb1UxIyJ&state=user
  let url = ctx.query.url
  url = decodeURIComponent(url)

  const urlObj = urlParse(url)
  const params = queryParse(urlObj.query)
  const code = params.code
  // 通过code换取用户信息
  const user = await api.wechat.getUserByCode(code)
  // 状态持久化
  ctx.session.user = user
  ctx.body = {
    success: true,
    data: user
  }
}

export async function wechatPay (ctx, next) {
  const ip = ctx.ip.replace('::ffff:', '')
  const session = ctx.session
  const {
    productId,
    name,
    phoneNumber,
    address
  } = ctx.request.body

  const product = await api.product.findProduct(productId)

  if (!product) {
    return (ctx.body = {
      success: false, err: '这个宝贝不在了'
    })
  }

  try {
    let user = await api.user.findUserByUnionId(session.user.unionid).exec()

    if (!user) {
      user = await api.user.saveFromSession(session)
    }

    const orderParams = {
      body: product.title,
      attach: '公众号周边手办支付',
      out_trade_no: 'Product' + (+new Date()),
      spbill_create_ip: ip,
      // total_fee: product.price * 100,
      total_fee: 0.01 * 100,
      openid: session.user.unionid,
      trade_type: 'JSAPI'
    }

    const order = await getParamsAsync(orderParams)
    const payment = await api.payment.create(user, product, order, '公众号', {
      name,
      address,
      phoneNumber
    })

    ctx.body = {
      success: true,
      data: payment.order
    }
  } catch (err) {
    ctx.body = {
      success: false,
      err: err
    }
  }
}
