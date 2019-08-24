const express = require('express')
const router = express.Router()
router.use('/', require('./debug'))
router.use('/login', require('./login'))
router.use('/logout', require('./logout'))
router.use('/user', require('./user'))
router.use('/signup', require('./signup'))
router.use('/decks', require('./decks'))
router.use('/study', require('./study'))
router.use('/study-history', require('./study-history'))
router.use('/card-body', require('./card-bodies'))
router.use('/password-reset', require('./password-reset'))

module.exports = router
