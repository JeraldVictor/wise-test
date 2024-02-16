const { body, param } = require('express-validator')

/**
 *
 * @param {string} idName
 * @description A common validator responsible to validate DB ids passed in the url's path variable
 */
const dbId = (idName) => {
  return [
    param(idName).notEmpty().isNumeric().withMessage(`${idName} is not valid`),
  ]
}

module.exports = { dbId }
