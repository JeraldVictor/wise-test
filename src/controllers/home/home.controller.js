const { ApiResponse } = require('../../utils/ApiResponse.js')
const { asyncHandler } = require('../../utils/asyncHandler.js')

/**
 * @swagger
 * /:
 *  get:
 *    description: Use to Check the Server status
 *    responses:
 *      '200':
 *        description: A successful response
 */
const homeController = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, 'OK', 'Hello World'))
})

module.exports = { homeController }
