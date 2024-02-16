const { ApiResponse } = require('../utils/ApiResponse.js')
const homeRouter = require('./home.routes.js')

module.exports = (app) => {
  app.use('/', homeRouter)

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
