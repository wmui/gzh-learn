import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'
export default function (opt, reply) {
  // 回复消息中间件
  return async function wechatMiddle (ctx, next) {
    const token = opt.token
    const {
      signature,
      nonce,
      timestamp,
      echostr
    } = ctx.query
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)
    // console.log(sha === signature)
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
      } else {
        ctx.body = 'signature error'
      }
    } else if (ctx.method === 'POST') {
      if (sha !== signature) {
        ctx.body = 'signature error'
        return false
      }
      // 签名成功，用户提交了数据
      const data = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })

      // const content = await util.parseXML(data)
      // const message = util.formatMessage(content.xml)
      // ctx.weixin = message
      ctx.weixin = {}

      await reply.apply(ctx, [ctx, next])

      const replyBody = ctx.body
      // const msg = ctx.weixin
      // const xml = util.tpl(replyBody, msg)
      console.log(replyBody)
      const xml = `<xml>
          <ToUserName><![CDATA[toUser]]></ToUserName>
          <FromUserName><![CDATA[fromUser]]></FromUserName>
          <CreateTime>12345678</CreateTime>
          <MsgType><![CDATA[text]]></MsgType>
          <Content><![CDATA[你好]]></Content>
        </xml>`
      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = xml
    }
  }
}
