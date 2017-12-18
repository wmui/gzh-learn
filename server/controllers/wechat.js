import api from '../api'
import config from '../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'

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
  // target是用户同意授权后前端的重定向地址
  const target = config.SITE_ROOT_URL + '/oauth'
  const scope = 'snsapi_userinfo'
  const { visit, id } = ctx.query
  const params = id ? `${visit}_${id}` : visit
  // 解析请求url并重定向到授权页
  const url = api.wechat.getAuthorizeURL(scope, target, params)

  ctx.redirect(url)
}

export async function oauth (ctx, next) {
  let url = ctx.query.url

  url = decodeURIComponent(url)

  const urlObj = urlParse(url)
  const params = queryParse(urlObj.query)
  const code = params.code
  const user = await api.wechat.getUserByCode(code)

  ctx.body = {
    success: true,
    data: user
  }
}

