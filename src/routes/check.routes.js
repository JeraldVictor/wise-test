const { Router } = require('express')
const { CheckIn, CheckOut } = require('../controllers/check/check.controller')
const { verifyJWT } = require('../middlewares/auth.middlewares')

const router = Router()
router.use(verifyJWT)

router.route('/In').post(CheckIn)
router.route('/Out').post(CheckOut)

module.exports = router
