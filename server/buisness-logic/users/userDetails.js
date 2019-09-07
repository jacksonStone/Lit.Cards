let { User } = require('../../database')

async function userDetails (userId) {
  return User.getSafeUser(userId)
}
async function UNSAFE_USER (userId) {
  return User.getUser(userId)
}
async function setDarkmode (userId, darkmodeValue) {
  return User.updateSafe(userId,  { darkMode: darkmodeValue })
}

async function setMisc(userId, changes) {
  return User.updateSafe(userId, changes)
}

exports.getUserDetails = userDetails
exports.setDarkmode = setDarkmode
exports.setMisc = setMisc;
exports.UNSAFE_USER = UNSAFE_USER
