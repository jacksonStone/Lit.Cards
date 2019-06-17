const db = require('../external-connections/fake-database-connector')
const tableName = 'user'

async function getUser (userId) {
  const results = await db.getRecord(tableName, { userId: userId })
  if (results && results.length) return results[0]
}

async function getSafeUser (userId) {
  const user = await getUser(userId)
  return trimUnsafeParameters(user)
}

async function userExists (userId) {
  const user = await getUser(userId)
  return !!user
}

function trimUnsafeParameters (user) {
  if (!user) return user
  delete user['password']
  delete user['salt']
  return user
}

async function createUser (userId, salt, password) {
  const results = await db.getRecord(tableName, { userId })
  if (results.length) return
  return db.setRecord(tableName, { userId, salt, password })
}

module.exports = {
  getUser,
  createUser,
  userExists,
  getSafeUser
}
