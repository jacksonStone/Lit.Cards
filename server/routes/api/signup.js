const express = require('express')
const router = express.Router()
const { signup, verifyEmail, sendVerificationEmail } = require('../../buisness-logic/authentication/signup')
const { getLoginCookie } = require('../../buisness-logic/authentication/login')
const { addCookie } = require('../../node-abstractions/cookie')
const code = require('../../node-abstractions/response-codes')
const { emailIsValid } = require('../../../shared/email-address-validation')

router.post('/', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  const userId = req.body.userId
  const password = req.body.password
  if (!userId || !password || !emailIsValid(userId)) return code.unauthorized(res)
  const newUser = await signup(userId, password)
  if (!newUser) {
    return code.invalidRequest(res)
  }
  const cookie = getLoginCookie(newUser)
  addCookie(res, cookie)
  return code.ok(res)
})

router.post('/verify-email', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  if (!req.userId) return code.unauthorized(res)
  const emailVerificationKey = req.body.emailVerificationKey
  const errorIfAny = await verifyEmail(req.userId, emailVerificationKey)
  if (errorIfAny) {
    return code.unauthorized(res, errorIfAny)
  }
  return code.ok(res)
})

router.get('/resend-verification-email', async (req, res) => {
  if (!req.userId) return code.unauthorized(res)
  if (req.user.verifiedEmail) {
    return code.unauthorized(res)
  }
  sendVerificationEmail(req.user)
  return code.ok(res)
})

module.exports = router
