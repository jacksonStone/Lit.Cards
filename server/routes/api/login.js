const express = require('express')
const router = express.Router()
const { getLoginCookie, verify } = require('../../buisness-logic/authentication/login')
const { UNSAFE_USER } = require('../../buisness-logic/users/userDetails')
const code = require('../../node-abstractions/response-codes')
const { addCookie } = require('../../node-abstractions/cookie')

router.post('/', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  const userId = req.body.userId
  const password = req.body.password
  if (!userId || !password) return code.unauthorized(res)
  const valid = await verify(userId, password)
  if (!valid) return code.unauthorized(res)
  const user = await UNSAFE_USER(userId)
  const cookie = getLoginCookie(user)
  addCookie(res, cookie)
  return code.ok(res)
})

module.exports = router
