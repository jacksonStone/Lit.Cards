const { login, logout, signup } = require('api/login')
const { fetchUserNoCache, clearUserData } = require('logic/getUser')
const code = require('api/responseCodes')
const pages = require('site/pages')
const { login: loginPage } = require('site/pages')

exports.login = async (username, password) => {
  if (!username || !password) throw new Error('Invalid arguments')
  const result = await login(username, password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    return pages.home()
  }
}

exports.navigateToLoginPage = async () => {
  console.log("NAVIGATION")
  return loginPage()
}

exports.signup = async (username, password) => {
  if (!username || !password) throw new Error('Invalid arguments')
  const result = await signup(username, password)
  await fetchUserNoCache()
  if (code.ok(result)) {
    return pages.home()
  }
}

exports.logout = async () => {
  await logout()
  clearUserData()
  pages.landingPage()
}
