const express = require('express')
const router = express.Router()

router.use('/login', require('./login'))
router.use('/logout', require('./logout'))
router.use('/user', require('./user'))
router.use('/signup', require('./signup'))
router.use('/cards', require('./cards'))
router.use('/decks', require('./decks'))
router.use('/study', require('./study'))
router.use('/card-body', require('./card-bodies'))

module.exports = router
