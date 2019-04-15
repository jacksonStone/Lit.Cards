const { login, logout, signup } = require('api/login')
const { fetchUserNoCache, clearUserData } = require('logic/getUser')
const code = require('api/responseCodes')
const pages = require('site/pages')
const { login: loginPage, signup:signupPage } = require('site/pages')

exports.login = async (userId, password) => {
  if (!userId || !password) throw new Error('Invalid arguments')
  const result = await login(userId, password)
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

exports.signup = async (userId, password) => {
  if (!userId || !password) throw new Error('Invalid arguments')
  const result = await signup(userId, password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    return pages.home()
  }
  throw new Error('Invalid arguments')
}

exports.logout = async () => {
  await logout()
  clearUserData()
  pages.landingPage()
}
