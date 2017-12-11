import request from 'request-promise'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: base + 'token?grant_type=client_credential'
}
export default class Wechat {
  constructor (opts) {
    // 添加Wechat对象的配置信息
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.fetchAccessToken()
  }

  async request (options) {
    // 必须序列化为json,request-promise的锅
    options = Object.assign({}, options, {json: true})
    try {
      const response = await request(options)
      console.log('wechat.js:' + response)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  async fetchAccessToken () {
    let data = await this.getAccessToken()
    // access_token如果过期者更新
    if (!this.isValidToken(data, 'access_token')) {
      data = await this.updateAccessToken()
    }
    // 此时的data一定是有效的，更新数据库中access_token信息
    await this.saveAccessToken(data)

    return data
  }

  async updateAccessToken () {
    const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret

    const data = await this.request({url: url})
    const now = Date.now()
    // 提前20毫秒缓冲时间
    const expiresIn = now + (data.expires_in - 200) * 1000

    data.expires_in = expiresIn

    return data
  }

  isValidToken (data, name) {
    // 对数据进行检测，因为可能是一个空对象
    if (!data || !data[name] || !data.expires_in) {
      return false
    }

    const expiresIn = data.expires_in
    const now = Date.now()

    if (now < expiresIn) {
      return true
    } else {
      return false
    }
  }
 }
