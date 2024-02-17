const { Router } = require('express')
const { CheckIn } = require('../controllers/check/check.controller')
const { verifyJWT } = require('../middlewares/auth.middlewares')

const router = Router()
router.use(verifyJWT)

router.route('/In').post(CheckIn)

module.exports = router
