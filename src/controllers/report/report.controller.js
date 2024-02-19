const { ApiResponse } = require('../../utils/ApiResponse.js')
const { asyncHandler } = require('../../utils/asyncHandler.js')
const { getReport } = require('./report.function.js')

/**
 * @swagger
 * /Report:
 *  get:
 *    tags:
 *      - Report
 *    description: to get aggregated monthly report for all the Instructors on Monthly basis
 *    parameters:
 *      - name: month
 *        in: query
 *        schema:
 *          type: YYYY-MM
 *          example: '2024-02'
 *          description: month should be given in YYYY-MM format
 *    responses:
 *      '200':
 *        description: A successful Checkin
 *      '422':
 *        description: In Valid Params
 *
 */
module.exports.reportController = asyncHandler(async (req, res) => {
  const { month } = req.query
  const report = await getReport({ month })
  return res
    .status(200)
    .json(new ApiResponse(200, report, 'Report Generated successfully'))
})
