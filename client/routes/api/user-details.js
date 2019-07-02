const { api } = require('./api-request')

exports.getUserDetails = () => {
  return api('user/me')
}
exports.setDarkMode = (darkMode) => {
  return api('user/me/darkmode', { darkMode })
}
