const authUtils = require('./utils')
const cookieUtils = require('./cookie')
const { User } = require('../../database')

async function verify (userId, plainTextPassword) {
  const user = await User.getUser(userId)
  if (!user) return false
  const hashResult = authUtils.hashValues(plainTextPassword, user.salt)
  return hashResult === user.password
}

function getLoginCookie (user) {
  return cookieUtils.createUserCookie(user.userId, user.validSession || 0)
}

async function getUser (cookies) {
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
  getUser
}
