const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const salt = 10
const UserSchema = new Schema({
  // user admin superAdmin
  role: {
    type: String,
    default: 'user'
  },
  openid: [String],
  unionid: String,
  nickname: String,
  address: String,
  province: String,
  country: String,
  city: String,
  sex: String,
  email: String,
  headimgurl: String,
  avatarUrl: String,
  password: String,
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

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

UserSchema.pre('save', function (next) {
  let user = this

  if (!user.isModified('password')) return next()
  // 修改了密码
  bcrypt.hash(user.password, salt, (error, hash) => {
    if (error) return next(error)

    user.password = hash
    next()
  })
})

UserSchema.methods = {
  comparePassword: function (_password, password) {
    bcrypt.hash(_password, salt, function (error, hash) {
      if (error) {
        console.log(error)
        return
      }
      _password = hash
    })

    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, function (err, isMatch) {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  }
}

mongoose.model('User', UserSchema)
