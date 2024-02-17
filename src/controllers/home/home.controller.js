const { ApiResponse } = require('../../utils/ApiResponse.js')
const { asyncHandler } = require('../../utils/asyncHandler.js')

/**
 * @swagger
 * /:
 *  get:
 *    tags:
 *      - Public API
 *    description: Use to Check the Server status
 *    responses:
 *      '200':
 *        description: A successful response
 */
module.exports.homeController = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, 'OK', 'Hello World'))
})

/**
 * @swagger
 * /Safe:
 *  get:
 *    tags:
 *      - Secured API
 *    description: Use to Check if user is Logged in
 *    responses:
 *      '200':
 *        description: A successful response
 */
module.exports.safeController = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, 'Welcome', 'User is logged in'))
})
