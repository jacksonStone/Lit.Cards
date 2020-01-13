let { User } = require('../../database')
async function userDetails (userEmail) {
  return User.getSafeUser(userEmail)
}
async function UNSAFE_USER (userEmail) {
  return User.getUser(userEmail)
}
async function UNSAFE_USER_BY_CUSTOMER_ID (customerId) {
  return User.getUserByCustomerId(customerId)
}
async function setDarkmode (userEmail, darkmodeValue) {
  return User.updateSafe(userEmail,  { darkMode: darkmodeValue })
}

async function setMisc(userEmail, changes) {
  return User.updateSafe(userEmail, changes)
}

async function UNSAFE_setMisc(userEmail, changes) {
  return User.update_UNSAFE(userEmail, changes)
}
exports.getUserDetails = userDetails
exports.setDarkmode = setDarkmode
exports.setMisc = setMisc;
exports.UNSAFE_USER = UNSAFE_USER
exports.UNSAFE_setMisc = UNSAFE_setMisc
exports.UNSAFE_USER_BY_CUSTOMER_ID = UNSAFE_USER_BY_CUSTOMER_ID
