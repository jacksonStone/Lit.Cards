let { User } = require('../../database')
let { now } = require('../../node-abstractions/time')
let { randomString } = require('../../node-abstractions/random')
let { sendMail } = require('../../node-abstractions/email')
let { getLoginCookie } = require('./login')
let authUtils = require('./utils');
let millisInADay = 1000 * 60 * 60 * 24;
let routeToVerifyReset = '/site/verify?token='
let baseURL = process.env.CARDS_SITE_DOMAIN_ROOT

function generateRandomReset() {
  return randomString(20, 'hex')
}
function hashRandomReset(user, token) {
  let salt = user.salt;
  return authUtils.hashValues(token, salt)
}

// Return the same thing for success or failure so they don't know nothin'!
async function passwordReset (userEmail) {
  let user = await User.getUser(userEmail)
  if (!user) {
    return
  }
  let resetToken = await generateRandomReset()
  let hashedResetToken = hashRandomReset(user, resetToken)
  let changes = { resetToken: hashedResetToken, resetTokenExpiration: now() + millisInADay * 3}
  await User.editUser(user.userEmail, changes)
  sendMail(
    userEmail,
    'Password Reset',
    `To reset password please navigate to this link: ${baseURL + routeToVerifyReset + resetToken}&user=${userEmail}`,
    `To reset password please navigate to this link: ${baseURL + routeToVerifyReset + resetToken}&user=${userEmail}`
  )
  return;
}

function validatePasswordResetVerify(user, unhashedResetToken) {
  if (!user) {
    return false
  }
  // User did not request password verify
  if (!user.resetToken || user.resetTokenExpiration < now()) {
    return false
  }
  let hashedResetToken = hashRandomReset(user, unhashedResetToken)
  if (user.resetToken !== hashedResetToken) {
    return false
  }
  return true
}

// Resets the user's password, and logs them in, invalidating all other sessions
async function passwordResetVerify (userEmail, unhashedResetToken, newPassword) {
  let user = await User.getUser(userEmail)
  if(!validatePasswordResetVerify(user, unhashedResetToken, newPassword)) {
    return 'unauthorized';
  }
  return changePasswordWithoutNeedingCurrentPassword(user, newPassword)
}
// For password resets
async function changePasswordWithoutNeedingCurrentPassword(user, newPassword) {
  let newPasswordHash = authUtils.hashValues(newPassword, user.salt)
  if (newPasswordHash === user.password) {
    return 'same password';
  }
  return _updatePassword(newPasswordHash, user)
}
//Returns a cookie if successful
async function changePassword(user, newPassword, currentPassword) {
  let currentPasswordAttemptHash = authUtils.hashValues(currentPassword, user.salt)
  if (currentPasswordAttemptHash !== user.password) {
    return 'wrong password';
  }
  if (newPassword === currentPassword) {
    return 'same password';
  }
  let newPasswordHash = authUtils.hashValues(newPassword, user.salt)
  return _updatePassword(newPasswordHash, user)
}

async function _updatePassword(passwordHash, user) {
  let validSession = user.validSession
  if(validSession!==undefined) {
    validSession += 1;
    // :) just so we don't have unbounded
    if(validSession > 1000000) validSession = 0
  } else {
    validSession = 1;
  }
  let changes = { password: passwordHash, validSession, resetToken: undefined, resetTokenExpiration: 0 }
  await User.editUser(user.userEmail, changes)
  let newUser = Object.assign({}, user, changes)
  let cookie = getLoginCookie(newUser)
  return cookie
}

module.exports = {
  passwordReset,
  passwordResetVerify,
  changePassword
}
