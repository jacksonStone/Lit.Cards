let express = require('express')
let router = express.Router()
let { passwordReset , passwordResetVerify, changePassword } = require('../../buisness-logic/authentication/password')
let code = require('../../node-abstractions/response-codes')
let { addCookie } = require('../../node-abstractions/cookie')
let { redirect } = require('../../node-abstractions/redirect')
let { emailIsValid } = require('../../../shared/email-address-validation')

router.post('/', async (req, res) => {
  let userId = req.body && req.body.userId
  if (!userId || !emailIsValid(userId)) return code.invalidRequest(res)
  await passwordReset(userId)
  return code.ok(res)
})

router.post('/verify', async (req, res) => {
  let body = req.body;
  let verificationToken = body && body.token;
  let userId = body && body.id;
  let newPassword = body && body.newPassword;

  if (!verificationToken || !userId || !newPassword) return code.invalidRequest(res)
  let cookieOrError = await passwordResetVerify(userId, verificationToken, newPassword)
  if(cookieOrError === 'unauthorized') {
    return code.unauthorized(res)
  }
  if (cookieOrError === 'same password') {
    return code.invalidRequest(res, cookieOrError)
  }
  addCookie(res, cookieOrError);
  return code.ok(res);
});

router.post('/change', async (req, res) => {
  if (!req.user) {
    return code.unauthorized(res)
  }
  let body = req.body
  let newPassword = body && body.newPassword;
  let currentPassword = body && body.currentPassword;
  if (!newPassword || !currentPassword) return code.invalidRequest(res)
  let cookieOrError = await changePassword(req.user, newPassword, currentPassword)
  if (cookieOrError === 'same password') {
    return code.invalidRequest(res, cookieOrError)
  }
  if (cookieOrError === 'wrong password') {
    return code.invalidRequest(res, cookieOrError)
  }
  addCookie(res, cookieOrError);
  return code.ok(res)
});

module.exports = router
