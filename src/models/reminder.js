const mongoose = require('mongoose')

const { Schema } = mongoose
const ReminderSchema = new Schema({
  recipients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipient'}],
  message: {type: String, required: true},
  title: {type: String, trim: true},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  remember_each: {type: Number, required: true, default: 1},
  reminder_date: {type: Date, required: true }, 
  creation_date: {type: Date, required: true},
  last_reminder_date: {type: Date, required: false, default: '2000/01/01'},
  self_reminder: {type: Boolean, required: true, default: false}
})

module.exports = mongoose.model('Reminder', ReminderSchema)
