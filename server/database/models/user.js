let db = require('../external-connections/fake-database-connector')
let tableName = 'user'
let _ = require('lodash')
let { randomString } = require('../../node-abstractions/random')
//Guilty until proven innocent!
let safeParametersToDynamicallyChange = [
  'hideProgress',
  'hideNavigation',
  'darkMode',
  'displayName'
];
// Guilty until proven innocent!
let safeParametersToReturn = [
  'userId',
  'verifiedEmail',
  // All props that a user can dynamically change
  // should be safe to return to the user
  ...safeParametersToDynamicallyChange
]



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


async function updateSafe(userId, changes) {
  const keys = Object.keys(changes);
  const keyLength = keys.length;
  const safeChanges = {};
  for (let i = 0; i < keyLength; i++) {
    if (safeParametersToDynamicallyChange.indexOf(keys[i]) !== -1) {
      safeChanges[keys[i]] = changes[keys[i]];
    }
  }
  return db.editRecord(tableName, { userId }, safeChanges)
}

function trimAllButSafeParameters (user) {
  if (!user) return user
  const safeUser = {};
  _.each(user, (value, prop) => {
    if(safeParametersToReturn.indexOf(prop) !== -1) {
      safeUser[prop] = user[prop];
    }
  })
  return safeUser
}

async function createUser (userId, salt, password, displayName) {
  let results = await db.getRecord(tableName, { userId })
  if (results.length) return
  let emailVerificationKey = await randomString(20, 'hex')
  return db.setRecord(tableName, { userId, salt, password, displayName, validSession: 0, emailVerificationKey, verifiedEmail: false })
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
  updateSafe,
  createUser,
  userExists,
  getSafeUser,
  updateDarkModeValue
}
