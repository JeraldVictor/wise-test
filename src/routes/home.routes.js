const { Router } = require('express')
const { homeController } = require('../controllers/home/home.controller')

const router = Router()

router.route('/').get(homeController)

module.exports = router
