const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')
const { errorHandler } = require('./middlewares/error.middlewares.js')
const routes = require('./routes/index.js')
const morgan = require('morgan')
const app = express()
const { CORS_ORIGIN } = require('./constants.js')

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

//! routes
routes(app)

// common error handling middleware
app.use(errorHandler)

module.exports = app
