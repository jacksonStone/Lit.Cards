const authUtils = require('./utils')
const cookieUtils = require('./cookie')
const { User } = require('../../database')

async function verify (userId, plainTextPassword) {
  const user = await User.getUser(userId)
  if (!user) return false
  const hashResult = authUtils.hashValues(plainTextPassword, user.salt)
  return hashResult === user.password
}

function getLoginCookie (userId) {
  return cookieUtils.createUserCookie(userId)
}

function getuserId (cookies) {
  if (!cookies) return
  return cookieUtils.validateUserCookie(cookies)
}

function getLogoutCookie () {
  return cookieUtils.createUserLoggedOutCookie()
}

module.exports = {
  verify,
  getLogoutCookie,
  getLoginCookie,
  getuserId
}
