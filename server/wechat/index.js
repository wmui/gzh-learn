import mongoose from 'mongoose'
import config from '../config'
import Wechat from './wechat.js'
import OAuth from './oauth.js'

const Token = mongoose.model('Token')
const Ticket = mongoose.model('Ticket')

const wechatConfig = {
  wechat: {
    appID: config.wechat.appID,
    appSecret: config.wechat.appSecret,
    token: config.wechat.token,
    // 数据库操作是异步的，拿到一个promise函数
    getAccessToken: async () => await Token.getAccessToken(),
    saveAccessToken: async (data) => await Token.saveAccessToken(data),
    getTicket: async () => await Ticket.getTicket(),
    saveTicket: async (data) => await Ticket.saveTicket(data)
  }
}

export const getWechat = () => {
  const wechatClient = new Wechat(wechatConfig.wechat)
  return wechatClient
}

export const getOAuth = () => {
  const oauthClient = new OAuth(wechatConfig.wechat)
  return oauthClient
}
