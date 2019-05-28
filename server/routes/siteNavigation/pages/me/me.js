const express = require('express')
const router = express.Router()
const { sendPage } = require('../../sendPage')
// Make sure they are logged in to view "me" pages
router.use((req, res, next) => {
  if (!req.userId) return res.redirect('/')
  next()
})

router.get('/', (_, res) => {
  sendPage(res, 'me/me')
})

router.use('/decks', require('./decks'))
router.use('/deck', require('./deck'))
router.use('/study', require('./study'))

module.exports = router
