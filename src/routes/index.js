const { ApiResponse } = require('../utils/ApiResponse.js')
const homeRouter = require('./home.routes.js')
const userRouter = require('./user.routes.js')
const authRouter = require('./auth.routes.js')

module.exports = (app) => {
  app.use('/', homeRouter)
  app.use('/User', userRouter)
  app.use('/Auth', authRouter)

  app.use('*', (req, res) => {
    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          'Route Not Found',
          'Route Not Found, Please check the URL'
        )
      )
  })
}
