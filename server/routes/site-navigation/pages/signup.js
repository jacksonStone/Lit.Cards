const express = require('express')
const router = express.Router()
const { sendPage } = require('../send-page')

router.get('/', async (req, res) => {
  sendPage(res, 'signup')
})

module.exports = router
