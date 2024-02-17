const { Router } = require('express')
const {
  homeController,
  safeController,
} = require('../controllers/home/home.controller')
const { verifyJWT } = require('../middlewares/auth.middlewares')

const router = Router()

router.route('/').get(homeController)
router.route('/Safe').get(verifyJWT, safeController)

module.exports = router
