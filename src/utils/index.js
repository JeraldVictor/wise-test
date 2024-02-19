const crypto = require('crypto')

module.exports.encrypt = (password) => {
  try {
    return crypto.pbkdf2Sync(password, 'salt', 10, 64, 'sha512').toString('hex')
  } catch (e) {
    console.log(e)
    throw e
  }
}

module.exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
