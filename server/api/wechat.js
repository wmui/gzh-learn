import { getWechat, getOAuth } from '../wechat'
import mongoose from 'mongoose'
const User = mongoose.model('User')
const client = getWechat()
const oauth = getOAuth()

export async function getSignatureAsync (url) {
  const data = await client.fetchAccessToken()
  const token = data.access_token
  // 当客户端发起请求wechat-signature后,这里数据库才会首次创建ticket表
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = client.sign(ticket, url)
  params.appId = client.appID

  return params
}

export function getAuthorizeURL (...args) {
  return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode (code) {
  const data = await oauth.fetchAccessToken(code)
  // const user = await oauth.getUserInfo(data.access_token, data.unionid)
  const user = await oauth.getUserInfo(data.access_token, data.openid)

  const existUser = await User.findOne({
    openid: data.openid
  }).exec()
  // 用户同意授权后，保存信息到数据库
  if (!existUser) {
    let newUser = new User({
      openid: [data.openid],
      unionid: data.unionid,
      nickname: user.nickname,
      province: user.province,
      country: user.country,
      city: user.city,
      headimgurl: user.headimgurl,
      sex: user.sex
    })

    await newUser.save()
  }

  return {
    nickname: user.nickname,
    province: user.province,
    country: user.country,
    city: user.city,
    unionid: user.unionid,
    headimgurl: user.headimgurl,
    sex: user.sex
  }
}
