let express = require('express')
let router = express.Router()
let { signup, verifyEmail, sendVerificationEmail } = require('../../buisness-logic/authentication/signup')
let { getLoginCookie } = require('../../buisness-logic/authentication/login')
let { addCookie } = require('../../node-abstractions/cookie')
let code = require('../../node-abstractions/response-codes')
let { emailIsValid } = require('../../../shared/email-address-validation')

router.post('/', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  let userEmail = req.body.userEmail
  let password = req.body.password
  let displayName = req.body.displayName
  if (!userEmail || !password || !emailIsValid(userEmail) || !displayName) return code.unauthorized(res)
  let newUser = await signup(userEmail, password, displayName)
  if (!newUser) {
    return code.invalidRequest(res)
  }
  let cookie = getLoginCookie(newUser)
  addCookie(res, cookie)
  return code.ok(res)
})

router.post('/verify-email', async (req, res) => {
  if (!req.body) return code.unauthorized(res)
  if (!req.userEmail) return code.unauthorized(res)
  let emailVerificationKey = req.body.emailVerificationKey
  let errorIfAny = await verifyEmail(req.userEmail, emailVerificationKey)
  if (errorIfAny) {
    return code.unauthorized(res, errorIfAny)
  }
  return code.ok(res)
})

router.get('/resend-verification-email', async (req, res) => {
  if (!req.userEmail) return code.unauthorized(res)
  if (req.user.verifiedEmail) {
    return code.unauthorized(res)
  }
  sendVerificationEmail(req.user)
  return code.ok(res)
})

module.exports = router
