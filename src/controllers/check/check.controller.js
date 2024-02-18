const { ApiResponse } = require('../../utils/ApiResponse')
const { asyncHandler } = require('../../utils/asyncHandler')
const { newCheckIn, newCheckOut } = require('./check.function')

/**
 * @swagger
 * /Check/In:
 *  post:
 *    tags:
 *      - Check In/Out API
 *    description: Check In API endpoint
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              check_in_day:
 *                type: string
 *                example: DD-MM-YYYY
 *              check_in_time:
 *                type: string
 *                example: HH:MM:SS
 *            example:
 *             check_in_day: 18-02-2024
 *             check_in_time: 10:00:00
 *    responses:
 *      '201':
 *        description: A successful Checkin
 *      '422':
 *        description: In Valid Params
 *
 */
module.exports.CheckIn = asyncHandler(async (req, res) => {
  const check = await newCheckIn({ ...req.body, user_id: req.user.id })
  return res
    .status(201)
    .json(new ApiResponse(201, check, 'Check In Done successfully'))
})

/**
 * @swagger
 * /Check/Out:
 *  post:
 *    tags:
 *      - Check In/Out API
 *    description: Check In API endpoint
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              check_out_day:
 *                type: string
 *                example: DD-MM-YYYY
 *              check_out_time:
 *                type: string
 *                example: HH:MM:SS
 *            example:
 *             check_out_day: 18-02-2024
 *             check_out_time: 10:30:00
 *    responses:
 *      '201':
 *        description: A successful CheckOut
 *      '422':
 *        description: In Valid Params
 *
 */
module.exports.CheckOut = asyncHandler(async (req, res) => {
  const check = await newCheckOut({ ...req.body, user_id: req.user.id })
  return res
    .status(201)
    .json(new ApiResponse(201, check, 'Check Out Done successfully'))
})
