const { body, param } = require('express-validator')

const userRegisterValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid'),
    body('mobile')
      .trim()
      .notEmpty()
      .withMessage('Mobile Number is required')
      .isNumeric()
      .withMessage('Only Numbers allowed')
      .isLength({ max: 10, min: 10 })
      .withMessage('Mobile Number Should be 10 numbers only'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ]
}

const adminOrderItemTypeValidator = () => {
  return [
    query('product_type')
      .trim()
      .notEmpty()
      .withMessage('Product Type required')
      .isIn(AvailableProductTypes)
      .withMessage('Product Type Should be valid'),
  ]
}

module.exports = {}
