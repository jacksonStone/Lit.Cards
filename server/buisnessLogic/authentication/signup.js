const authUtils = require('./utils')
const { User } = require('../../database')

async function signup (username, plainTextPassword) {
  const existingUser = await User.getUser(username)
  if (existingUser) return

  const salt = authUtils.getSalt()
  const password = authUtils.hashValues(plainTextPassword, salt)
  return User.createUser(username, salt, password)
}

module.exports = {
  signup
}
