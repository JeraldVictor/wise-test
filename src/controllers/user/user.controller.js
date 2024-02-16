const { ApiResponse } = require('../../utils/ApiResponse.js')
const { asyncHandler } = require('../../utils/asyncHandler.js')
const { getUsers, newUser } = require('./user.function.js')

/**
 * @swagger
 * /User:
 *  get:
 *    tags:
 *      - 📢 Users APIs
 *    description: Get List of Users
 *    responses:
 *      '200':
 *        description: A successful response
 */
module.exports.listUsers = asyncHandler(async (req, res) => {
  const users = await getUsers()
  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Users fetched successfully'))
})

/**
 * @swagger
 * /User:
 *  post:
 *    description: Create a User
 *    tags:
 *      - 📢 Users APIs
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Johm
 *              user_name:
 *                type: string
 *                example: Johm
 *              password:
 *                type: string
 *                example: Johm
 *            example:
 *             name: John
 *             user_name: john
 *             password: john@123
 *    responses:
 *      '201':
 *        description: A successful response
 *      '422':
 *        description: parameter is not passed
 */
module.exports.createUser = asyncHandler(async (req, res) => {
  const users = await newUser(req.body)
  return res
    .status(201)
    .json(new ApiResponse(201, users, 'Users created successfully'))
})
