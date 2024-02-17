const { Router } = require('express')
const { login, logout } = require('../controllers/auth/auth.controller')

const router = Router()

router.route('/Login').post(login)
router.route('/Logout').get(logout)

module.exports = router
