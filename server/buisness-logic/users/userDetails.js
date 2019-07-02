const { User } = require('../../database')

async function userDetails (userId) {
  return User.getSafeUser(userId)
}
async function setDarkmode (userId, darkmodeValue) {
  return User.updateDarkModeValue(userId, darkmodeValue)
}

exports.getUserDetails = userDetails
exports.setDarkmode = setDarkmode
