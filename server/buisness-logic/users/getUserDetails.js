const { User } = require('../../database')

async function getUserDetails (userId) {
  return User.getSafeUser(userId)
}

exports.getUserDetails = getUserDetails
