const { ApiError } = require('../utils/ApiError.js')
const { asyncHandler } = require('../utils/asyncHandler.js')
const { validateAccessToken } = require('../controllers/auth/auth.function')

module.exports.verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    throw new ApiError(401, 'Unauthorized request')
  }

  const user = await validateAccessToken(token)
  req.user = user

  next()
})
