const express = require('express')
const router = express.Router()
const { signup } = require('../../buisnessLogic/authentication/signup')
const { getLoginCookie } = require('../../buisnessLogic/authentication/login')
const { addCookie } = require('../../nodeAbstractions/cookie')
const code = require('../../nodeAbstractions/responseCodes')

router.post('/', async (req, res) => {
  if (!req.body) return code.unathorized(res)
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) return code.unathorized(res)

  const newUser = await signup(username, password)
  if (!newUser) {
    return code.invalidRequest(res)
  }
  const cookie = getLoginCookie(username)
  addCookie(res, cookie)
  return code.ok(res)
})

module.exports = router
