module.exports = {
  errorHandler: async (error, req, res, next) => {
    let message
    switch (req.route.path) {
      case '/notifications/email' :
        message = 'Error sending email notification'
        break
      case '/notifications/sms' :
        message = 'Error sending sms notification'
        break
      case '/notification/:id' :
        message = 'Error finding notification'
        break
      case '/user/:id' :
        switch (req.method) {
          case 'GET' :
            message = 'Error finding user'
            break
          case 'PUT' :
            message = 'Error updating user'
            break
        }
        break
      case '/users' :
        switch (req.method) {
          case 'GET' :
            message = 'Error finding user'
            break
          case 'POST' :
            message = 'Error creating user'
            break
        }
        break
    }

    console.log(error.stack)
    res.status(400).json({error: error.message, message: message})
  }
}
