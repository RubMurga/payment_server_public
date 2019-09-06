const mongoose = require('mongoose')

const { Schema } = mongoose
const recipientSchema = new Schema({
    name: {type: String, required: true},
    email_notification: {type: Boolean, required: true, default: true},
    sms_notification: {type: Boolean, required: true, default: false},
    email: {type: String, required: false},
    phone_number: {type: String, required: false}, 
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
})

module.exports = mongoose.model('Recipient', recipientSchema)