let db = require('../external-connections/fake-database-connector')
let tableName = 'user'
let _ = require('lodash')
let { randomString } = require('../../node-abstractions/random')

async function getUser (userId) {
  let results = await db.getRecord(tableName, { userId: userId })
  if (results && results.length) return results[0]
}
async function getSafeUser (userId) {
  let user = await getUser(userId)
  return trimAllButSafeParameters(user)
}

async function userExists (userId) {
  let user = await getUser(userId)
  return !!user
}
// Guilty until proven innocent!
let safeParameters = [
  'userId',
  'darkMode',
  'verifiedEmail'
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
  let results = await db.getRecord(tableName, { userId })
  if (results.length) return
  let emailVerificationKey = await randomString(20, 'hex')
  return db.setRecord(tableName, { userId, salt, password, validSession: 0, emailVerificationKey, verifiedEmail: false })
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
