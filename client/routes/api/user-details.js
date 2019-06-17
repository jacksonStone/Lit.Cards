const { api } = require('./api-request')

exports.getUserDetails = () => {
  return api('user/me')
}
