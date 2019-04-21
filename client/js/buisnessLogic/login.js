const { login, logout, signup } = require('api/login')
const { fetchUserNoCache, clearUserData } = require('logic/getUser')
const code = require('api/responseCodes')
const pages = require('site/pages')
const { login: loginPage, signup: signupPage } = require('site/pages')

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
