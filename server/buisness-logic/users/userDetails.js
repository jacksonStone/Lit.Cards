let { User } = require('../../database')

async function userDetails (userEmail) {
  return User.getSafeUser(userEmail)
}
async function UNSAFE_USER (userEmail) {
  return User.getUser(userEmail)
}
async function setDarkmode (userEmail, darkmodeValue) {
  return User.updateSafe(userEmail,  { darkMode: darkmodeValue })
}

async function setMisc(userEmail, changes) {
  return User.updateSafe(userEmail, changes)
}

exports.getUserDetails = userDetails
exports.setDarkmode = setDarkmode
exports.setMisc = setMisc;
exports.UNSAFE_USER = UNSAFE_USER
