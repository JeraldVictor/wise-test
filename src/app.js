const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')
const { errorHandler } = require('./middlewares/error.middlewares.js')
const routes = require('./routes/index.js')
const morgan = require('morgan')
const app = express()
const { CORS_ORIGIN } = require('./constants.js')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

dotenv.config({
  path: './.env',
})

// global middlewares
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
)

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(morgan('dev'))

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Instructor Attendance System',
      description: 'Coding Task: Backend Engineer',
      contact: {
        name: 'Jerald Victor J',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['**/*.controller.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//! routes
routes(app)

// common error handling middleware
app.use(errorHandler)

module.exports = app
