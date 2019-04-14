const { api } = require('./apiRequest')

exports.login = (username, password) => {
  return api('login', { username, password })
}

exports.logout = () => {
  return api('logout')
}

exports.signup = (username, password) => {
  return api('signup', { username, password })
}
