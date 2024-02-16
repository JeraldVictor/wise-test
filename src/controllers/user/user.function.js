const { User } = require('../../db/models')
const { encrypt } = require('../../utils')
const { ApiError } = require('../../utils/ApiError')

module.exports.getUsers = async () => {
  return User.findAll({ raw: true, nest: true })
}

module.exports.newUser = async ({ name, user_name, password }) => {
  if (!name) {
    throw new ApiError(422, 'name is required')
  }
  if (!user_name) {
    throw new ApiError(422, 'user_name is required')
  }
  if (!password) {
    throw new ApiError(422, 'password is required')
  }

  return await User.create({
    name,
    user_name,
    password: encrypt(password),
  })
}
