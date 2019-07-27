const { User } = require('../../database')
const { now } = require('../../node-abstractions/time')
const { randomString } = require('../../node-abstractions/random')
const { sendMail } = require('../../node-abstractions/email')
const { getLoginCookie } = require('./login')
const authUtils = require('./utils');
const millisInADay = 1000 * 60 * 60 * 24;
const routeToVerifyReset = '/site/verify?token='
const baseURL = process.env.SITE_DOMAIN_ROOT

function generateRandomReset() {
  return randomString(20, 'hex')
}
function hashRandomReset(user, token) {
  const salt = user.salt;
  return authUtils.hashValues(token, salt)
}

// Return the same thing for success or failure so they don't know nothin'!
async function passwordReset (userId) {
  const user = await User.getUser(userId)
  if (!user) {
    return
  }
  const resetToken = await generateRandomReset()
  const hashedResetToken = hashRandomReset(user, resetToken)
  const changes = { resetToken: hashedResetToken, resetTokenExpiration: now() + millisInADay * 3}
  await User.editUser(user.userId, changes)
  sendMail(
    userId,
    'Password Reset',
    `To reset password please navigate to this link: ${baseURL + routeToVerifyReset + resetToken}&user=${userId}`,
    `To reset password please navigate to this link: ${baseURL + routeToVerifyReset + resetToken}&user=${userId}`
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
  const hashedResetToken = hashRandomReset(user, unhashedResetToken)
  if (user.resetToken !== hashedResetToken) {
    return false
  }
  return true
}

// Resets the user's password, and logs them in, invalidating all other sessions
async function passwordResetVerify (userId, unhashedResetToken, newPassword) {
  const user = await User.getUser(userId)
  if(!validatePasswordResetVerify(user, unhashedResetToken, newPassword)) {
    return 'unauthorized';
  }
  return changePasswordWithoutNeedingCurrentPassword(user, newPassword)
}
// For password resets
async function changePasswordWithoutNeedingCurrentPassword(user, newPassword) {
  const newPasswordHash = authUtils.hashValues(newPassword, user.salt)
  if (newPasswordHash === user.password) {
    return 'same password';
  }
  return _updatePassword(newPasswordHash, user)
}
//Returns a cookie if successful
async function changePassword(user, newPassword, currentPassword) {
  const currentPasswordAttemptHash = authUtils.hashValues(currentPassword, user.salt)
  if (currentPasswordAttemptHash !== user.password) {
    return 'wrong password';
  }
  if (newPassword === currentPassword) {
    return 'same password';
  }
  const newPasswordHash = authUtils.hashValues(newPassword, user.salt)
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
  const changes = { password: passwordHash, validSession, resetToken: undefined, resetTokenExpiration: 0 }
  await User.editUser(user.userId, changes)
  const newUser = Object.assign({}, user, changes)
  const cookie = getLoginCookie(newUser)
  return cookie
}

module.exports = {
  passwordReset,
  passwordResetVerify,
  changePassword
}
