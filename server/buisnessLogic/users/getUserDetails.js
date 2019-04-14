const { User } = require('../../database')

async function getUserDetails (username) {
  return User.getSafeUser(username)
}

exports.getUserDetails = getUserDetails
