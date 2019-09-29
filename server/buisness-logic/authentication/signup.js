let authUtils = require('./utils')
let { User } = require('../../database')
let { sendMail } = require('../../node-abstractions/email')
let baseURL = process.env.SITE_DOMAIN_ROOT
let routeToVerifyEmail = '/site/me?verification='

async function signup (userId, plainTextPassword, displayName) {
  let existingUser = await User.getUser(userId)
  if (existingUser) return

  let salt = authUtils.getSalt()
  let password = authUtils.hashValues(plainTextPassword, salt)
  let user = await User.createUser(userId, salt, password, displayName)
  sendVerificationEmail(user);
  return user
}
async function sendVerificationEmail(user) {
  let userId = user.userId
  sendMail(
    userId,
    'Email Verification',
    `To verify your email please navigate to this link: ${baseURL + routeToVerifyEmail + user.emailVerificationKey}`,
    `To verify your email please navigate to this link: ${baseURL + routeToVerifyEmail + user.emailVerificationKey}`
  )
}

async function verifyEmail(userId, verificationKey) {
  let user = await User.getUser(userId)
  if (user.verifiedEmail) {
    return 'Already verified';
  }
  if (user.emailVerificationKey !== verificationKey) {
    return 'Invalid verification key';
  }
  await User.editUser(user.userId, { emailVerificationKey: undefined, verifiedEmail: true })
}

module.exports = {
  signup,
  verifyEmail,
  sendVerificationEmail
}
