const { ApiResponse } = require('../../utils/ApiResponse')
const { asyncHandler } = require('../../utils/asyncHandler')
const { newCheckIn } = require('./check.function')

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
