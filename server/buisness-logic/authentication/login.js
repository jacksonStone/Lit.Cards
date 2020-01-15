let authUtils = require('./utils')
let cookieUtils = require('./cookie')
let { User } = require('../../database')

async function verify (userEmail, plainTextPassword) {
  let user = await User.getUser(userEmail)
  if (!user) return false
  let hashResult = authUtils.hashValues(plainTextPassword, user.salt)
  return hashResult === user.password
}

function getLoginCookie (user) {
  return cookieUtils.createUserCookie(user, user.validSession || 0)
}

function getUserFromCookie (cookies) {
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
  getUserFromCookie
}
