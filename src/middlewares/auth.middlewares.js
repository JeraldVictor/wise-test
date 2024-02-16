// const { USER_EXCLUDE_ATTRIBUTES, ACCESS_TOKEN_SECRET } = require('../../constants.js')
const { ApiError } = require('../utils/ApiError.js')
const { asyncHandler } = require('../utils/asyncHandler.js')
const jwt = require('jsonwebtoken')

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    throw new ApiError(401, 'Unauthorized request')
  }

  try {
    // TODO: If User Validation is needed
    // const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET)
    // const user = await User.findOne({
    //   where: {
    //     id: decodedToken?.id,
    //   },
    //   attributes: {
    //     exclude: USER_EXCLUDE_ATTRIBUTES,
    //   },
    // })
    // if (!user) {
    //   // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    //   // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    //   throw new ApiError(401, 'Invalid access token')
    // }
    // req.user = user

    next()
  } catch (error) {
    // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
    // Then they will get a new access token which will allow them to refresh the access token without logging out the user
    throw new ApiError(401, error?.message || 'Invalid access token')
  }
})

module.exports = { verifyJWT }
