require('dotenv').config()
const express = require('express')
const compression = require('compression')
const mongoose = require('mongoose')
const {wrap} = require('./src/util/wrap')
const email = require('./src/util/email')
const transport = email.getTransport()
const {errorHandler} = require('./src/util/errorHandler')
const app = express()
const DBOPTIONS = { keepAlive: 1, connectTimeoutMS: 30000 }
const PORT = process.env.PORT || 3000
const Reminder = require('./src/models/reminder')
const User = require('./src/models/user')
const Recipient = require('./src/models/recipient')

async function run () {
  
  app.use(compression())
  // Allowed Headers
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
    next()
  })
  app.use(errorHandler)
  // Mongoose bootstrapping
  mongoose.Promise = global.Promise
  mongoose.connect("here goes your connection string", DBOPTIONS)
  const db = mongoose.connection
  db.on('error', wrap(console.error.bind(console, 'DB connection error: ')))

  app.listen(PORT)
  console.log(`Listening on port: ${PORT}`)
  setInterval(async () => {
    transport.on('token', token => {
      console.log('A new access token was generated');
      console.log('User: %s', token.user);
      console.log('Access Token: %s', token.accessToken);
      console.log('Expires: %s', new Date(token.expires));
    });
    let today = new Date()
    let users = await User.find({})
    if (today.getHours() >= 10){
      for (let user of users){
        let reminders = await Reminder.find({user: user._id})
        for (let reminder of reminders){
          // Emails
          if ( (today.getDate()+1 == reminder.reminder_date.getDate()) && ((today.getMonth() - (reminder.reminder_date.getMonth()-1)) % (reminder.remember_each) == 0  )  ){
            if (reminder.last_reminder_date.getDate() == today.getDate() && reminder.last_reminder_date.getMonth() == today.getMonth() && reminder.last_reminder_date.getFullYear() == today.getFullYear())  continue
            let recipients = null
            if (reminder.self_reminder) recipients = [user]
            else recipients = await Recipient.find({_id: reminder.recipients})
            let new_emails = recipients.map(recipient => email.prepareEmail(recipient, reminder, user))
            await email.sendEmail(transport, new_emails)
            reminder.last_reminder_date = today
            await reminder.save()
            console.log("Reminder set for ", reminder.title)
            if (!reminder.self_reminder){
              let self_email = await email.createSelfEmail(user,reminders)
              await email.sendEmail(transport, self_email)
            }
          }
          // SMS
        }
      }
    }
    //reminders = await Reminder.find({})
    //console.log(reminders)
  }, 10000) // 9000000

  
}
run().catch(error => console.error(error.stack))

module.exports = app
