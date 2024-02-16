const { Router } = require('express')
const { listUsers, createUser } = require('../controllers/user/user.controller')

const router = Router()

router.route('/').get(listUsers).post(createUser)

module.exports = router
