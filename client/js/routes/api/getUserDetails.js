const { api } = require('./apiRequest')

exports.getUserDetails = () => {
  return api('user/me')
}
