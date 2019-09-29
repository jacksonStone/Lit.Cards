let authUtils = require('./utils')
let experation = 1000 * 60 * 60 * 24 * 30
let authCookieName = 'auth'
let {UNSAFE_USER} = require('../users/userDetails')

// Expects cookie to be JSON and already de
function checkCookieExperation (deCookieContent) {
  if (!deCookieContent) return false
  let body = JSON.parse(deCookieContent)

  if (!body.created) return false
  // See if expired
  let born = body.created
  let present = Date.now()
  if ((present - born) < experation) {
    return body
  }
  return false
}

async function validateUserCookie (cookies) {
  if (!cookies || !cookies.auth) return
  let authCookie = cookies.auth
  let decryptedCookie = authUtils.decrypt(authCookie)
  let youngCookie = checkCookieExperation(decryptedCookie)
  if (!youngCookie) {
    return
  }
  let userEmail = youngCookie.userEmail
  let user = await UNSAFE_USER(userEmail)
  if (!user) {
    return
  }
  if (user.validSession === youngCookie.session) {
    return user
  }
}

function createUserCookie (userEmail, session) {
  let now = Date.now()
  var userCookie = {
    userEmail: userEmail,
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
