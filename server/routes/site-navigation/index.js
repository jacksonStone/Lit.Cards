var express = require('express')
var router = express.Router()

router.use('/me', require('./pages/me/me'))
router.use('/home', require('./pages/home'))
router.use('/login', require('./pages/login'))
router.use('/signup', require('./pages/signup'))

module.exports = router
