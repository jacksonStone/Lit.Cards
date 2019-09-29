let express = require('express')
let router = express.Router()
let { getLoginCookie, verify } = require('../../buisness-logic/authentication/login')
let { UNSAFE_USER } = require('../../buisness-logic/users/userDetails')
let code = require('../../node-abstractions/response-codes')
let { addCookie } = require('../../node-abstractions/cookie')

router.post('/', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  let userEmail = req.body.userEmail
  let password = req.body.password
  if (!userEmail || !password) return code.unauthorized(res)
  let valid = await verify(userEmail, password)
  if (!valid) return code.unauthorized(res)
  let user = await UNSAFE_USER(userEmail)
  let cookie = getLoginCookie(user)
  addCookie(res, cookie)
  return code.ok(res)
})

module.exports = router
