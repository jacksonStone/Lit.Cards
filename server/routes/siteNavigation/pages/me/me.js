var express = require('express')
var router = express.Router()

// Make sure they are logged in to view "me" pages
router.use((req, res, next) => {
  if (!req.username) return res.redirect('/')
  next()
})

router.use('/decks', require('./decks'))

module.exports = router
