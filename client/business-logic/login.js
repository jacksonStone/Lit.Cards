let { login, logout, verifyPasswordReset, resetPassword, signup, resendEmailVerification, verifyEmail, changePassword } = require('../routes/api/login')
let { fetchUserNoCache, clearUserData } = require('./user')
let code = require('../routes/api/response-codes')
let pages = require('../routes/navigation/pages')
let { getParam } = require('abstract/url')
let { emailIsValid } = require('shared/email-address-validation')
let { login: loginPage, signup: signupPage } = require('../routes/navigation/pages')

exports.login = async (userId, password) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  let recordError = window.lc.recordError
  if (!userId || !password) {
    if (!userId) {
      recordError('fields.userId', 'empty')
    }
    if (!password) {
      recordError('fields.password', 'empty')
    }
    return
  }
  let result = await login(userId, password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    pages.home()
    return
  }
  recordError('abstract.loginFailed', true)
}

exports.resetPassword = async (userId) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  let recordError = window.lc.recordError
  if (!userId) {
    recordError('fields.userId', 'empty')
    return
  }
  if (!emailIsValid(userId)) {
    recordError('abstract.badEmail', true)
    return
  }
  return resetPassword(userId)
}

exports.verifyPasswordReset = async (password, repeatPassword) => {
  let recordError = window.lc.recordError
  window.lc.resetErrors() // make sure we have no field failures hanging around

  if (!password || !repeatPassword) {
    if (!password) {
      recordError('fields.password', 'empty')
    }
    if (!repeatPassword) {
      recordError('fields.repeatPassword', 'empty')
    }
    return
  }
  if (password !== repeatPassword) {
    recordError('abstract.mismatchPasswords', true)
    return
  }
  // TODO:: Maybe redirect them to a different page that
  // doesn't have it in the URL to prevent leaking on referer if they leave page
  // before finishing reset
  let result = await verifyPasswordReset(getParam('user'), getParam('token'), password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    return pages.home()
  }
}

exports.navigateToLoginPage = async () => {
  return loginPage()
}
exports.navigateToSignupPage = async () => {
  return signupPage()
}

exports.signup = async (userId, password, repeatPassword, displayName) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  let recordError = window.lc.recordError

  if (!userId || !password || !repeatPassword || !displayName) {
    if (!userId) {
      recordError('fields.userId', 'empty')
    }
    if (!password) {
      recordError('fields.password', 'empty')
    }
    if (!repeatPassword) {
      recordError('fields.repeatPassword', 'empty')
    }
    if (!displayName) {
      recordError('fields.displayName', 'empty')
    }
    return
  }
  if (password !== repeatPassword) {
    recordError('abstract.mismatchPasswords', true)
    return
  }
  if (!emailIsValid(userId)) {
    recordError('abstract.badEmail', true)
    return
  }

  let result = await signup(userId, password, displayName)
  await fetchUserNoCache()
  if (code.ok(result)) {
    return pages.home()
  }
  recordError('abstract.usernameTaken', true)
}
exports.changePassword = async (currentPassword, password, repeatPassword) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  window.lc.setData('updatedPassword', false)
  let recordError = window.lc.recordError

  if (!password || !repeatPassword || !currentPassword) {
    if (!password) {
      recordError('fields.password', 'empty')
    }
    if (!repeatPassword) {
      recordError('fields.repeatPassword', 'empty')
    }
    if (!currentPassword) {
      recordError('fields.currentPassword', 'empty')
    }
    return
  }
  if (password !== repeatPassword) {
    recordError('abstract.mismatchPasswords', true)
    return
  }

  let result = await changePassword(currentPassword, password)
  if (code.ok(result)) {
    return window.lc.setData('updatedPassword', true)
  }
  if (result === 'same password') {
    recordError('abstract.samePassword', true)
  }
  if (result === 'wrong password') {
    recordError('abstract.wrongPassword', true)
  }
}

exports.logout = async () => {
  await logout()
  clearUserData()
  pages.landingPage()
}

exports.verifyEmail = async () => {
  let token = getParam('verification')
  if (!token) {
    return
  }
  await verifyEmail(token)
}
exports.resendEmailVerification = async () => {
  await resendEmailVerification()
}
