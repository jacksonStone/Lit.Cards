let authUtils = require('./utils')
let { User } = require('../../database')
let { sendMail } = require('../../node-abstractions/email')
let baseURL = process.env.CARDS_SITE_DOMAIN_ROOT
let routeToVerifyEmail = '/site/me?verification='

async function signup (userEmail, plainTextPassword, displayName) {
  userEmail = userEmail.toLowerCase();
  let existingUser = await User.getUser(userEmail)
  if (existingUser) return

  let salt = authUtils.getSalt()
  let password = authUtils.hashValues(plainTextPassword, salt)
  const trialDuration = new Date();
  trialDuration.setDate(trialDuration.getDate() + 14);
  let user = await User.createUser(userEmail, salt, password, displayName, trialDuration.getTime())
  sendVerificationEmail(user);
  return user
}
async function sendVerificationEmail(user) {
  let userEmail = user.userEmail
  //We may only have the cookie-portion of the user
  if(!user.emailVerificationKey) {
    user = await User.getUser(userEmail);
  }
  sendMail(
    userEmail,
    'Email Verification',
    `To verify your email please navigate to this link: ${baseURL + routeToVerifyEmail + user.emailVerificationKey}`,
    `To verify your email please navigate to this link: ${baseURL + routeToVerifyEmail + user.emailVerificationKey}`
  )
}

async function verifyEmail(userEmail, verificationKey) {
  let user = await User.getUser(userEmail)
  if (user.verifiedEmail) {
    return 'Already verified';
  }
  if (user.emailVerificationKey !== verificationKey) {
    return 'Invalid verification key';
  }
  await User.editUser(user.userEmail, { emailVerificationKey: undefined, verifiedEmail: true })
}

module.exports = {
  signup,
  verifyEmail,
  sendVerificationEmail
}
