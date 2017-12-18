import { getWechat, getOAuth } from '../wechat'
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
  const user = await oauth.getUserInfo(data.access_token, data.openid)
  return user
}
