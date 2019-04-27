const express = require('express')
const router = express.Router()
const { getuserId } = require('../../../buisnessLogic/authentication/login')
const { sendPage } = require('../sendPage')

router.get('/', async (req, res) => {
  const userId = await getuserId(req.cookies)
  // Need to login
  if (!userId) return res.redirect('/')

  sendPage(res, 'app-header.js')
})

module.exports = router
