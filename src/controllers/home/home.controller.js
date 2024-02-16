const { ApiResponse } = require('../../utils/ApiResponse.js')
const { asyncHandler } = require('../../utils/asyncHandler.js')

const homeController = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, 'OK', 'Hello World'))
})

module.exports = { homeController }
