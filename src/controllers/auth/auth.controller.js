const { ApiResponse } = require('../../utils/ApiResponse.js')
const { asyncHandler } = require('../../utils/asyncHandler.js')
const { checkLogin, generateAccessToken } = require('./auth.function.js')

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
}

/**
 * @swagger
 * /Auth/Login:
 *  post:
 *    description: Login User
 *    tags:
 *      - 🔐 Auth APIs
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_name:
 *                type: string
 *                example: Johm
 *              password:
 *                type: string
 *                example: Johm
 *            example:
 *             user_name: john
 *             password: john@123
 *    responses:
 *      '201':
 *        description: A successful response
 *      '401':
 *        description: Invalid user Credentials
 *      '422':
 *        description: Missing arguments
 */
module.exports.login = asyncHandler(async (req, res) => {
  const user = await checkLogin(req.body)
  const accessToken = await generateAccessToken(user)

  return res
    .status(201)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(201, { accessToken, user }, 'Users loggedin successfully')
    )
})

/**
 * @swagger
 * /Auth/Logout:
 *  get:
 *    description: Logout User
 *    tags:
 *      - 🔐 Auth APIs
 *    responses:
 *      '200':
 *        description: A successful response
 */
module.exports.logout = asyncHandler(async (req, res) => {
  res
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, null, 'Users logged out successfully'))
})
