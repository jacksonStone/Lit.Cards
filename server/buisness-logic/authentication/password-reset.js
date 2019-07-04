const authUtils = require('./utils')
const cookieUtils = require('./cookie')
const { User } = require('../../database')
const { sendMail } = require('../../node-abstractions/email')

const routeToVerifyReset = '/api/verify?token='
const baseURL = process.env.SITE_DOMAIN_ROOT
// Return the same thing for success or failure so they don't know nothin'!
async function resetPassword (userId) {
  const newUser = await User.resetPassword(userId)
  if (!newUser) return
  sendMail(
    userId,
    'Password Reset',
    `To reset password please navigate to this link: ${baseURL + routeToVerifyReset + newUser.resetToken}`,
    `To reset password please navigate to this link: ${baseURL + routeToVerifyReset + newUser.resetToken}`
  )
  return;
}

module.exports = {
  resetPassword
}
