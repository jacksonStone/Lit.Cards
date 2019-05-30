const express = require('express')
const router = express.Router()
const { signup } = require('../../buisnessLogic/authentication/signup')
const { getLoginCookie } = require('../../buisnessLogic/authentication/login')
const { addCookie } = require('../../nodeAbstractions/cookie')
const code = require('../../nodeAbstractions/responseCodes')

router.post('/', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  const userId = req.body.userId
  const password = req.body.password
  if (!userId || !password) return code.unauthorized(res)

  const newUser = await signup(userId, password)
  if (!newUser) {
    return code.invalidRequest(res)
  }
  const cookie = getLoginCookie(userId)
  addCookie(res, cookie)
  return code.ok(res)
})

module.exports = router
