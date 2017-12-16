import xml2js from 'xml2js'
import template from './tpl'
import sha1 from 'sha1'

function parseXML (xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

function formatMessage (result) {
  let message = {}

  if (typeof result === 'object') {
    const keys = Object.keys(result)

    for (let i = 0; i < keys.length; i++) {
      let item = result[keys[i]]
      let key = keys[i]

      if (!(item instanceof Array) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        let val = item[0]

        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        } else {
          message[key] = (val || '').trim()
        }
      } else {
        message[key] = []

        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }

  return message
}

function tpl (content, message) {
  let type = 'text'
  // 只有图文消息是数组
  if (Array.isArray(content)) {
    type = 'news'
  }

  // content是用户回复消息后，我的服务器处理消息后返回的数据
  if (!content) {
    content = 'Empty News'
  }

  if (content && content.type) {
    type = content.type
  }

  let info = Object.assign({}, {
    content: content,
    createTime: new Date().getTime(),
    msgType: type,
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName
  })
  // 需要把json消息转为xml格式返回
  return template(info)
}


function raw (args) {
  let keys = Object.keys(args)
  let newArgs = {}
  let str = ''

  keys = keys.sort()
  keys.forEach((key) => {
    newArgs[key.toLowerCase()] = args[key]
  })

  for (let k in newArgs) {
    str += '&' + k + '=' + newArgs[k]
  }

  return str.substr(1)
}

function signIt (nonce, ticket, timestamp, url) {
  const ret = {
    jsapi_ticket: ticket,
    nonceStr: nonce,
    timestamp: timestamp,
    url: url
  }

  const string = raw(ret)
  const sha = sha1(string)

  return sha
}

function sign (ticket, url) {
  const nonce = Math.random().toString(36).substr(2, 15)
  const timestamp = parseInt(new Date().getTime() / 1000, 0) + ''
  const signature = signIt(nonce, ticket, timestamp, url)

  return {
    noncestr: nonce,
    timestamp: timestamp,
    signature: signature
  }
}

export {
  parseXML,
  formatMessage,
  tpl,
  sign
}
