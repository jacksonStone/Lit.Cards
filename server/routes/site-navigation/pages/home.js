const express = require('express')
const router = express.Router()
const { getuserId } = require('../../../buisness-logic/authentication/login')
const { sendPage } = require('../send-page')

router.get('/', async (req, res) => {
  const userId = await getuserId(req.cookies)
  // Need to login
  if (!userId) return res.redirect('/')

  sendPage(res, 'app-header.js')
})

module.exports = router
