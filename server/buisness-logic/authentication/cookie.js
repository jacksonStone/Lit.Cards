const authUtils = require('./utils')
const experation = 1000 * 60 * 60 * 24 * 30
const authCookieName = 'auth'

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

function validateUserCookie (cookies) {
  if (!cookies || !cookies.auth) return
  const authCookie = cookies.auth
  const decryptedCookie = authUtils.decrypt(authCookie)
  const youngCookie = checkCookieExperation(decryptedCookie)
  if (youngCookie) {
    return youngCookie.userId
  }
}

function createUserCookie (userId) {
  const now = Date.now()
  var userCookie = {
    userId: userId,
    created: now
  }
  var encryptedCookied = authUtils.encrypt(JSON.stringify(userCookie))

  return {
    value: encryptedCookied,
    name: authCookieName,
    options: {
      maxAge: experation,
      httpOnly: true
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
