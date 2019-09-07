let { api } = require('./api-request')

exports.getUserDetails = () => {
  return api('user/me')
}
exports.setDarkMode = (darkMode) => {
  return api('user/me/misc', { darkMode })
}
exports.setMiscDetails = (change) => {
  return api('user/me/misc', change)
}
