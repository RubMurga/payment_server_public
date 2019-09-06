const nodemailer = require('nodemailer')
module.exports = {
  getTransport: function () {
    let config = {
      service: 'gmail',
      port: '25',
      secure: false,
      auth: {
        user: 'email user',
        pass: 'email password'
      },
      tls: {
        rejectUnauthorized: false
      }
    }
    let transport = nodemailer.createTransport(config)
    return transport
  },
  createSelfEmail: async (user, reminders) => {
    if (!user.email_notification) return
    let message = `
      <h1> Se han enviado notificaciones de pago correspondientes a los recordatorios: </h1><ul>
    `
    let list_reminders = '';
    for (let reminder of reminders) list_reminders += '<li>' +reminder.title + '</li>'
    message += list_reminders + '</ul> <br> <br> <br> <br> <i> Este es un mensaje automático. </i>'

    let email = {
      from: '"User name" <name@mail.com>',
      bcc: user.email,
      subject: 'Payment notifications sent',
      html: message
    } 
    return [email]
  },
  prepareEmail: function (recipient, reminder, user) {
    if (!recipient.email_notification) return
    if (this.validateEmails(recipient.email) === false) throw new Error('Invalid email')
    else if (!reminder.message) throw new Error('Message required')
    message = reminder.message.replace("#recipient#", recipient.name)
    message = reminder.message.replace("#number_payments#", reminder.remember_each)
    let from = null
    if (reminder.self_reminder) from = 'Auto reminder ' + user.name
    else from = user.name 
    let email = {
      from: '"' + from +'" <name@mail.com>',
      bcc: recipient.email,
      subject: reminder.title || 'Notificación de pago',
      html: message
    }
    return email
  },
  sendEmail: async function (transporter, emails) {
    try {
      const emailP = emails.map(email => transporter.sendMail(email))
      await Promise.all(emailP)
    } catch (error) {
      console.log(error)
      throw new Error(`Error sending email
      ${error.name} - ${error.message}`)
    }
  },
  validateEmails: function (emails) {
    let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emails || emails.length < 1) return false
    else if (typeof emails === 'string' && emailRegex.test(emails)) return true
    else if (Array.isArray(emails)) {
      let emailsLength = emails.length
      for (let index = 0; index < emailsLength; index++) {
        if (emailRegex.test(emails[index]) === false) return false
      }
      return true
    } else return false
  }
}
