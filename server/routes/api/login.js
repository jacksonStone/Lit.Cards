const express = require('express')
const router = express.Router()
const { getLoginCookie } = require('../../buisnessLogic/authentication/login')
const code = require('../../nodeAbstractions/responseCodes')
const { addCookie } = require('../../nodeAbstractions/cookie')

router.post('/', async (req, res) => {
  if (!req.body) return code.unathorized(res)
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) return code.unathorized(res)
  const cookie = getLoginCookie(username)
  addCookie(res, cookie)
  return code.ok(res)
})

module.exports = router
