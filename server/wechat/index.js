import mongoose from 'mongoose'
import config from '../config'
import Wechat from './wechat.js'

const Token = mongoose.model('Token')
// const Ticket = mongoose.model('Ticket')

const wechatConfig = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token: config.wechat.token,
    // 数据库操作是异步的，拿到一个promise函数
    // 调用后返回结果如下： 
    // {
    //   name: 'access_token',
    //   token: data.access_token,
    //   expires_in: data.expires_in
    // }
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (data) => await Token.saveAccessToken(data)
  }
}

export const getWechat = () => {
  const wechatClient = new Wechat(wechatConfig.wechat)
  return wechatClient
}

// getWechat()
