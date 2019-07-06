const { login, logout, verifyPasswordReset, resetPassword } = require('../routes/api/login')
const { fetchUserNoCache, clearUserData } = require('./user')
const code = require('../routes/api/response-codes')
const pages = require('../routes/navigation/pages')
const { getParam } = require('abstract/url')
const { login: loginPage, signup: signupPage } = require('../routes/navigation/pages')

exports.login = async (userId, password) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  const recordError = window.lc.recordError
  if (!userId || !password) {
    if (!userId) {
      recordError('fields.userId', 'empty')
    }
    if (!password) {
      recordError('fields.password', 'empty')
    }
    return
  }
  const result = await login(userId, password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    pages.home()
    return
  }
  recordError('abstract.loginFailed', true)
}

exports.resetPassword = async (userId) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  const recordError = window.lc.recordError
  if (!userId) {
    recordError('fields.userId', 'empty')
    return
  }
  const result = await resetPassword(userId)
}

exports.verifyPasswordReset = async (password, repeatPassword) => {
  const recordError = window.lc.recordError

  if (!password || !repeatPassword) {
    if (!password) {
      recordError('fields.password', 'empty')
    }
    if (!repeatPassword) {
      recordError('fields.repeatPassword', 'empty')
    }
    return;
  }
  if (password !== repeatPassword) {
    recordError('abstract.mismatchPasswords', true)
    return;
  }
  // TODO:: Maybe redirect them to a different page that
  // doesn't have it in the URL to prevent leaking on referer if they leave page
  // before finishing reset
  const result = await verifyPasswordReset(getParam('user'), getParam('token'), password)
  debugger;
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

exports.signup = async (userId, password, repeatPassword) => {
  window.lc.resetErrors() // make sure we have no field failures hanging around
  const recordError = window.lc.recordError

  if (!userId || !password || !repeatPassword) {
    if (!userId) {
      recordError('fields.userId', 'empty')
    }
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

  const result = await signup(userId, password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    return pages.home()
  }
  recordError('abstract.usernameTaken', true)
}

exports.logout = async () => {
  await logout()
  clearUserData()
  pages.landingPage()
}
