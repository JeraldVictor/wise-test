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
app.use(
  morgan(function (tokens, req, res) {
    if (process.env.NODE_ENV === 'production')
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ')
  })
)

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
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'http://localhost:3000',
          description: 'Production server',
        },
      ],
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
