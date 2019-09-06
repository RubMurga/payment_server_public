const mongoose = require('mongoose')

const { Schema } = mongoose
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const userSchema = new Schema({
  name: {type: String, trim: true, required: true, min: 2},
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: {type: String, required: true},
  email_notification: {type: Boolean, required: true, default: false},
  sms_notification: {type: Boolean, required: true, default: false},
  phone_number: {type: String, required: false}, 
  notificationCount: {
    email: {type: Number, default: 0},
    sms: {type: Number, default: 0}
  }
}, { emitIndexErrors: true })

userSchema.methods.increaseCount = function (type) {
  var user = this
  switch (type) {
    case 'email':
      user.notificationCount.email++
      break
    case 'sms':
      user.notificationCount.sms++
      break
    default:
      break
  }
  return user.save().catch(err => { throw new Error(err) })
}

userSchema.pre('save', function (next) {
  var user = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}
const castErrorMongoose = (error, doc, next) => {
  if (error.name === 'CastError') next(new Error('There was an error trying to cast UserId'))
}

const saveError = (error, doc, next) => {
  console.log(error)
  if (error) next(new Error('There was an error trying to create user'))
}
userSchema.post('findOne', castErrorMongoose)
userSchema.post('findOneAndUpdate', castErrorMongoose)
userSchema.post('save', saveError)

module.exports = mongoose.model('User', userSchema)
