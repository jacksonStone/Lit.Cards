let db = require('../external-connections/configured-connector')
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
  'userEmail',
  'verifiedEmail',
  'activeSubscription',
  'planExpiration',
  'trialUser',
  // All props that a user can dynamically change
  // should be safe to return to the user
  // Except stripePaymentMethodId
  ...(safeParametersToDynamicallyChange.slice(0, safeParametersToDynamicallyChange.length - 1))
]



async function getUser (userEmail) {
  let results = await db.getRecord(tableName, { userEmail: userEmail }, 1)
  if (results) return results
}
async function getUserByCustomerId (customerId) {
  let results = await db.getRecord(tableName, { stripeCustomerId:  customerId}, 1)
  if (results) return results
}
async function getSafeUser (userEmail) {
  let user = await getUser(userEmail)
  return trimAllButSafeParameters(user)
}

async function userExists (userEmail) {
  let user = await getUser(userEmail)
  return !!user
}


async function updateSafe(userEmail, changes) {
  const keys = Object.keys(changes);
  const keyLength = keys.length;
  const safeChanges = {};
  for (let i = 0; i < keyLength; i++) {
    if (safeParametersToDynamicallyChange.indexOf(keys[i]) !== -1) {
      safeChanges[keys[i]] = changes[keys[i]];
    }
  }
  return db.editRecord(tableName, { userEmail }, safeChanges)
}
//Most scenarios will call for updateSafe
async function update_UNSAFE(userEmail, changes) {
  return db.editRecord(tableName, { userEmail }, changes)
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

async function createUser (userEmail, salt, password, displayName, trialCutoff) {
  let results = await db.getRecord(tableName, { userEmail }, 1)
  if (results) return
  let emailVerificationKey = await randomString(20, 'hex')
  return db.setRecord(tableName, { userEmail, salt, password, displayName, validSession: 0, emailVerificationKey, verifiedEmail: false, trialUser: true, planExpiration: trialCutoff });
}

function editUser(userEmail, changes) {
  return db.editRecord(tableName, { userEmail }, changes)
}

async function updateDarkModeValue(userEmail, darkmodeValue) {
  return db.editRecord(tableName, { userEmail }, { darkMode: darkmodeValue })
}

module.exports = {
  getUser,
  getUserByCustomerId,
  editUser,
  updateSafe,
  update_UNSAFE,
  createUser,
  userExists,
  getSafeUser,
  updateDarkModeValue
}
