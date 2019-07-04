const express = require('express')
const router = express.Router()
const { resetPassword } = require('../../buisness-logic/authentication/password-reset')
const code = require('../../node-abstractions/response-codes')
const { addCookie } = require('../../node-abstractions/cookie')

router.post('/', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  await resetPassword(userId)
  return code.ok(res)
})

module.exports = router
