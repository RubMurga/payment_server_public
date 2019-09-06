const swaggerJSDoc = require('swagger-jsdoc')
const base = process.env.PWD
var swaggerConfig = {}
//  Swagger config
swaggerConfig.swaggerDefinition = {
  info: { // API informations (required)
    title: 'Notifications', // Title (required)
    version: '1.0.0', // Version (required)
    description: 'Swagger UI for notifications REST API' // Description (optional)
  }
  //  host: 'localhost:3000', // Host (optional)
  //  basePath: '/api' // Base path (optional)
}
swaggerConfig.options = {
  // Import swaggerDefinitions
  swaggerDefinition: swaggerConfig.swaggerDefinition,
  // Path to the API docs
  apis: [base + '/docs/*.yaml']
}

swaggerConfig.swaggerSpec = swaggerJSDoc(swaggerConfig.options)
module.exports = swaggerConfig
