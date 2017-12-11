import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'
export default function(opt, reply) {
  // 回复消息中间件
  return async function wechatMiddle(ctx, next) {
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
    // GET请求表示微信服务器发送token验证请求
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr
      } else {
        ctx.body = 'signature error'
      }
    } else if (ctx.method === 'POST') {
      // POST请求是用户触发的请求，如关注了公众号，发送了消息
      if (sha !== signature) {
        ctx.body = 'signature error'
        return false
      }

      // 签名成功，拿到用户提交的信息，ctx.req是微信服务器向你的服务器发送的请求
      const data = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })
      // console.log('middleware.js data:')
      // Buffer数据
      // console.log(data) 



      const content = await util.parseXML(data)
      // console.log('middleware.js content:')
      // console.log(content) 
      /*{ 
        xml: {
          ToUserName: ['gh_0fa46f0b76c8'],
          FromUserName: ['oFmK60iOdfVp-hJx2K_AXG1IH-jM'],
          CreateTime: ['1512994307'],
          MsgType: ['text'],
          Content: ['5'],
          MsgId: ['6498261068067058886']
        }
      }*/

      const message = util.formatMessage(content.xml)
      // console.log(message)
      /*{
        ToUserName: 'gh_0fa46f0b76c8',
        FromUserName: 'oFmK60iOdfVp-hJx2K_AXG1IH-jM',
        CreateTime: '1512994307',
        MsgType: 'text',
        Content: '5',
        MsgId: '6498261068067058886' 
      }*/

      // ctx对象添加一个weixin属性
      ctx.weixin = message


      await reply.apply(ctx, [ctx, next])
      // 拿到处理后的数据，比如一段文本或是一个图片地址
      const replyBody = ctx.body

      // msg和message信息是一样的
      const msg = ctx.weixin
      // ('2', {ToUserName: 'gh_0fa46f0b76c8'}) 这里有疑问，编译原理？
      const xml = util.tpl(replyBody, msg)
      // console.log(xml)
      /*<xml>
        <ToUserName><![CDATA[oFmK60iOdfVp-hJx2K_AXG1IH-jM]]></ToUserName>
        <FromUserName><![CDATA[gh_0fa46f0b76c8]]></FromUserName>
        <CreateTime>1512995315319</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[5]]></Content>
      </xml>*/

      ctx.status = 200
      ctx.type = 'application/xml'
      // 把生成的xml返会给微信服务器，微信服务器解析后呈献给用户
      ctx.body = xml
    }
  }
}