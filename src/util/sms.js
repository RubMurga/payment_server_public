module.exports = {
  prepareAndSendSMS: async function (recipients, body, countryCode) {
    let stringErr = 'Error: Recipients must be strings or an Array of strings, each with a min length of 10'
    if (!body) throw new Error('Error, body can\'t be empty')
    else if (this.validateNumbers(recipients) === false) throw new Error(stringErr)
    else {
      try {
        if (Array.isArray(recipients)) await this.processRecipients(recipients, body, countryCode)
        else await this.send(recipients, body, countryCode)
      } catch (error) {
        throw new Error(`Error sending sms\n${error.name} - ${error.message}`)
      }
    }
  },
  processRecipients: async function (recipients, body, countryCode) {
    const msgPromises = recipients.map(address => this.send(address, body, countryCode))
    await Promise.all[msgPromises]
  },
  send: async function (recipient, body, countryCode) {
    try {
      let num = countryCode ? recipient : '+52' + recipient
      if (process.env.NODE_ENV === 'test') await Promise.resolve(true)
    } catch (error) {
      throw new Error(error)
    }
  },
  validateNumbers: function (recipients) {
    let type = typeof recipients
    if (!recipients) return false
    else if (type === 'string' && recipients.length >= 10) return true
    else if (Array.isArray(recipients)) {
      let totalRecipients = recipients.length
      for (let i = 0; i < totalRecipients; i++) {
        if (typeof recipients[i] !== 'string' || recipients[i].length < 10) return false
      }
      return true
    } else return false
  }
}
