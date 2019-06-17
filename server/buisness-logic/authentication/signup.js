const authUtils = require('./utils')
const { User } = require('../../database')

async function signup (userId, plainTextPassword) {
  const existingUser = await User.getUser(userId)
  if (existingUser) return

  const salt = authUtils.getSalt()
  const password = authUtils.hashValues(plainTextPassword, salt)
  return User.createUser(userId, salt, password)
}

module.exports = {
  signup
}
