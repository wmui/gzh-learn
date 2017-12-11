// 处理消息回复
const tip = '你好，<a href="https://github.com/wmui/gzh-learn">查看源代码</a>'
export default function(ctx, next) {
  // 拿到微信返回的消息，判断事件类型，返回自定义内容
  const message = ctx.weixin
  /* 事件 */
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      // 关注了公众号
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取消关注')
    } else if (message.Event === 'LOCATION') {
      // 发送了位置信息
      ctx.body = message.Latitude + ' : ' + message.Longitude
    } else if (message.Event === 'view') {
      ctx.body = message.EventKey + message.MenuId
    } else if (message.Event === 'pic_sysphoto') {
      ctx.body = message.Count + ' photos sent'
    }
  } else if (message.MsgType === 'text') {
  	/* 文本 */
  	ctx.body = message.Content
  } else if (message.MsgType === 'image') {
  	/* 图片 */
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
  	/* 语音 */
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'video') {
  	/* 视频 */
    ctx.body = {
      type: 'video',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    /* 地理位置 */
    ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
  } else if (message.MsgType === 'link') {
  	/* 分享链接 */
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: 'https://picsum.photos/200/300',
      url: message.Url
    }]
  }
}