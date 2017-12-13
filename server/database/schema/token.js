/*
 * token model
 */
const mongoose = require('mongoose')
const TokenSchema = new mongoose.Schema({
  name: String,
  token: String,
  expires_in: Number,
  meta: {
    // token的创建时间
    createdAt: {
      type: Date,
      default: Date.now()
    },
    // token更新时间
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
// 向数据库插入数据前执行的回掉
TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    // 新token
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    // token已存在，更新token
    this.meta.updatedAt = Date.now()
  }
  next()
})

// statics定义model的静态方法
TokenSchema.statics = {
  async getAccessToken () {
    const result = await this.findOne({
      name: 'access_token'
    }).exec()

    if (result && result.token) {
      return result
    } else {
      return {}
    }
  },

  async saveAccessToken (data) {
    // data是微信服务器返回的access_token和express_in信息
    let result = await this.findOne({
      name: 'access_token'
    }).exec()

    if (result) {
      result.token = data.access_token
      result.expires_in = data.expires_in
    } else {
      // 查询结果为空就新增一条数据
      result = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in
      })
    }

    await result.save()

    return data
  }
}

const Token = mongoose.model('Token', TokenSchema)
