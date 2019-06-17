const { api } = require('./api-request')

exports.login = (userId, password) => {
  return api('login', { userId, password })
}

exports.logout = () => {
  return api('logout')
}

exports.signup = (userId, password) => {
  return api('signup', { userId, password })
}
