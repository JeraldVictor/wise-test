const { Router } = require('express')
const { reportController } = require('../controllers/report/report.controller')
const { verifyJWT } = require('../middlewares/auth.middlewares')

const router = Router()
router.use(verifyJWT)

router.route('/').get(reportController)

module.exports = router
