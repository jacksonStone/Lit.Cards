const express = require('express')
const router = express.Router()
const { getUsername } = require('../../../buisnessLogic/authentication/login')
const { sendPage } = require('../sendPage')

router.get('/', async (req, res) => {
  const username = await getUsername(req.cookies)
  console.log(username)
  // Need to login
  if (!username) return res.redirect('/')

  sendPage(res, 'app-header.js')
})

module.exports = router
