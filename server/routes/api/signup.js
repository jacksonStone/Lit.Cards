const express = require('express')
const router = express.Router()
const { signup } = require('../../buisness-logic/authentication/signup')
const { getLoginCookie } = require('../../buisness-logic/authentication/login')
const { addCookie } = require('../../node-abstractions/cookie')
const code = require('../../node-abstractions/response-codes')

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
