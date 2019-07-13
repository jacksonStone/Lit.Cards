const authUtils = require('./utils')
const experation = 1000 * 60 * 60 * 24 * 30
const authCookieName = 'auth'
const {UNSAFE_USER} = require('../users/userDetails')

// Expects cookie to be JSON and already de
function checkCookieExperation (deCookieContent) {
  if (!deCookieContent) return false
  const body = JSON.parse(deCookieContent)

  if (!body.created) return false
  // See if expired
  const born = body.created
  const present = Date.now()
  if ((present - born) < experation) {
    return body
  }
  return false
}

async function validateUserCookie (cookies) {
  if (!cookies || !cookies.auth) return
  const authCookie = cookies.auth
  const decryptedCookie = authUtils.decrypt(authCookie)
  const youngCookie = checkCookieExperation(decryptedCookie)
  if (!youngCookie) {
    return
  }
  const userId = youngCookie.userId
  const user = await UNSAFE_USER(userId)
  if (!user) {
    return
  }
  if (user.validSession === youngCookie.session) {
    return user
  }
}

function createUserCookie (userId, session) {
  const now = Date.now()
  var userCookie = {
    userId: userId,
    created: now,
    session
  }
  var encryptedCookied = authUtils.encrypt(JSON.stringify(userCookie))

  return {
    value: encryptedCookied,
    name: authCookieName,
    options: {
      maxAge: experation,
      httpOnly: true,
      overwrite: true
    }
  }
}

function createUserLoggedOutCookie () {
  return {
    value: '',
    name: authCookieName,
    options: {
      maxAge: experation,
      httpOnly: true
    }
  }
}

module.exports = { validateUserCookie, createUserCookie, createUserLoggedOutCookie }
