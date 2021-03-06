/*
 * Ticket model
 */
const mongoose = require('mongoose')
const TicketSchema = new mongoose.Schema({
  name: String,
  ticket: String,
  expires_in: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
TicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

// statics定义model的静态方法
TicketSchema.statics = {
  async getTicket () {
    const result = await this.findOne({
      name: 'ticket'
    }).exec()

    if (result && result.ticket) {
      return result
    } else {
      return {}
    }
  },

  async saveTicket (data) {
    // data是微信服务器返回的ticket和express_in信息
    let result = await this.findOne({
      name: 'ticket'
    }).exec()

    if (result) {
      result.ticket = data.ticket
      result.expires_in = data.expires_in
    } else {
      // 查询结果为空就新增一条数据
      result = new Ticket({
        name: 'ticket',
        ticket: data.ticket,
        expires_in: data.expires_in
      })
    }

    await result.save()

    return data
  }
}

const Ticket = mongoose.model('Ticket', TicketSchema)
