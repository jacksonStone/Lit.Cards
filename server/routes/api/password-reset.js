const express = require('express')
const router = express.Router()
const { passwordReset , passwordResetVerify, changePassword } = require('../../buisness-logic/authentication/password')
const code = require('../../node-abstractions/response-codes')
const { addCookie } = require('../../node-abstractions/cookie')
const { redirect } = require('../../node-abstractions/redirect')
const { emailIsValid } = require('../../../shared/email-address-validation')

router.post('/', async (req, res) => {
  const userId = req.body && req.body.userId
  if (!userId || !emailIsValid(userId)) return code.invalidRequest(res)
  await passwordReset(userId)
  return code.ok(res)
})

router.post('/verify', async (req, res) => {
  const body = req.body;
  const verificationToken = body && body.token;
  const userId = body && body.id;
  const newPassword = body && body.newPassword;

  if (!verificationToken || !userId || !newPassword) return code.invalidRequest(res)
  const cookieOrError = await passwordResetVerify(userId, verificationToken, newPassword)
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
  const newPassword = body && body.newPassword;
  if (!newPassword) return code.invalidRequest(res)
  const cookieOrError = await changePassword(req.userId, newPassword)
  if (cookieOrError === 'same password') {
    return code.invalidRequest(res, cookieOrError)
  }
  addCookie(res, cookieOrError);
  return redirect(res, '/site/me');
});

module.exports = router
