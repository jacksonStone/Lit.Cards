const authUtils = require('./utils')
const { User } = require('../../database')
const { sendMail } = require('../../node-abstractions/email')
const baseURL = process.env.SITE_DOMAIN_ROOT
const routeToVerifyEmail = '/site/me?verification='

async function signup (userId, plainTextPassword) {
  const existingUser = await User.getUser(userId)
  if (existingUser) return

  const salt = authUtils.getSalt()
  const password = authUtils.hashValues(plainTextPassword, salt)
  const user = await User.createUser(userId, salt, password)
  sendVerificationEmail(user);
  return user
}
async function sendVerificationEmail(user) {
  const userId = user.userId
  sendMail(
    userId,
    'Email Verification',
    `To verify your email please navigate to this link: ${baseURL + routeToVerifyEmail + user.emailVerificationKey}`,
    `To verify your email please navigate to this link: ${baseURL + routeToVerifyEmail + user.emailVerificationKey}`
  )
}

async function verifyEmail(userId, verificationKey) {
  const user = await User.getUser(userId)
  if (user.verifiedEmail) {
    return 'Already verified';
  }
  console.log(user.emailVerificationKey, verificationKey)
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
