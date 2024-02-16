const crypto = require('crypto')

module.exports.encrypt = (password) => {
  try {
    return crypto.pbkdf2Sync(password, 'salt', 10, 64, 'sha512').toString('hex')
  } catch (e) {
    console.log(e)
    throw e
  }
}
