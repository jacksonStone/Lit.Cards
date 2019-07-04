const db = require('../external-connections/fake-database-connector')
const tableName = 'user'
const crypto = require('crypto');
const { now } = require('../../node-abstractions/time')
const millisInADay = 1000 * 60 * 60 * 24;
const NUM_OF_BYTES_FOR_32_CHAR_BASE_64 = 24
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

function generateRandomReset() {
  return new Promise((resolve) => {
    crypto.randomBytes(NUM_OF_BYTES_FOR_32_CHAR_BASE_64, (err, buf) => {
      if (err) throw err;
      resolve(buf.toString('base64'))
    });
  })
}

async function resetPassword (userId) {
  const resetToken = await generateRandomReset()
  await db.editRecord(tableName, { userId }, { resetToken, resetTokenExpiration: now() + millisInADay * 3 })
  return await getUser(userId)
}

async function updateDarkModeValue(userId, darkmodeValue) {
  return db.editRecord(tableName, { userId }, {darkMode: darkmodeValue})
}

module.exports = {
  getUser,
  createUser,
  userExists,
  getSafeUser,
  resetPassword,
  updateDarkModeValue
}
