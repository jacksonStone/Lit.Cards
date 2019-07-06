const db = require('../external-connections/fake-database-connector')
const tableName = 'user'
const _ = require('lodash')
async function getUser (userId) {
  const results = await db.getRecord(tableName, { userId: userId })
  if (results && results.length) return results[0]
}
async function getSafeUser (userId) {
  const user = await getUser(userId)
  return trimAllButSafeParameters(user)
}

async function userExists (userId) {
  const user = await getUser(userId)
  return !!user
}
// Guilty until proven innocent!
const safeParameters = [
  'userId',
  'darkMode'
]
function trimAllButSafeParameters (user) {
  if (!user) return user
  _.each(user, (value, prop) => {
    if(safeParameters.indexOf(prop) === -1) {
      delete user[prop]
    }
  })
  return user
}

async function createUser (userId, salt, password) {
  const results = await db.getRecord(tableName, { userId })
  if (results.length) return
  return db.setRecord(tableName, { userId, salt, password, validSession: 0 })
}

function editUser(userId, changes) {
  return db.editRecord(tableName, { userId }, changes)
}

async function updateDarkModeValue(userId, darkmodeValue) {
  return db.editRecord(tableName, { userId }, { darkMode: darkmodeValue })
}

module.exports = {
  getUser,
  editUser,
  createUser,
  userExists,
  getSafeUser,
  updateDarkModeValue
}
