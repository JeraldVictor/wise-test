const dotenv = require('dotenv')
dotenv.config({
  path: '../.env',
})

const PORT = process.env.PORT || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
const UserRolesEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
}

const AvailableUserRoles = Object.values(UserRolesEnum)

module.exports = {
  PORT,
  CORS_ORIGIN,
  ACCESS_TOKEN_SECRET,
  UserRolesEnum,
  AvailableUserRoles,
}
