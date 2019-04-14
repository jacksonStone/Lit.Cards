const db = require('../externalConnections/fakeData')
const tableName = 'deck'
const { userExists } = require('./user')

async function getDecks (username) {
  const results = await db.getRecord(tableName, { username })
  return results || []
}

async function deckExists (username, name) {
  const results = await db.getRecord(tableName, { username, name })
  return !!results.length
}

async function createDeck (username, name) {
  if (!username || !name) return

  // Prevent conflict
  const currentDeck = await deckExists(username, name)
  if (currentDeck) return

  // Required
  const currentUser = await userExists(username)
  if (!currentUser) return

  return db.setRecord(tableName, { username, name })
}

module.exports = {
  getDecks,
  deckExists,
  createDeck
}
