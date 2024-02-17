const { User } = require('../../db/models')
const { encrypt } = require('../../utils')
const { ApiError } = require('../../utils/ApiError')
const jwt = require('jsonwebtoken')

module.exports.checkLogin = async ({ user_name, password }) => {
  if (!user_name) {
    throw new ApiError(422, 'user_name is required')
  }
  if (!password) {
    throw new ApiError(422, 'password is required')
  }
  const user = await User.findOne({
    where: {
      user_name,
      password: encrypt(password),
    },
  })

  if (!user) {
    throw new ApiError(401, 'Invalid user Credentials')
  }

  return user
}

module.exports.generateAccessToken = async ({ id, name, user_name }) => {
  if (!id) {
    throw new ApiError(422, 'id is required')
  }
  if (!user_name) {
    throw new ApiError(422, 'user_name is required')
  }
  if (!name) {
    throw new ApiError(422, 'name is required')
  }

  return jwt.sign(
    {
      id,
      name,
      user_name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}

module.exports.validateAccessToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findOne({
      where: {
        id: decodedToken?.id,
      },
    })

    if (!user) {
      throw new ApiError(401, 'Invalid access token')
    }
    return user
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token')
  }
}
