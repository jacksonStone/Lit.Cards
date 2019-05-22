const db = require('../externalConnections/fakeData')
const tableName = 'deck'
const { userExists } = require('./user')

async function getDecks (userId) {
  const results = await db.getRecord(tableName, { userId })
  return results || []
}
async function getDeck (userId, deck) {
  const results = await db.getRecord(tableName, { userId, id: deck })
  if (results && results.length) {
    return results[0]
  }
  return {}
}

async function deckExists (userId, name) {
  const results = await db.getRecord(tableName, { userId, name })
  return !!results.length
}

async function createDeck (userId, name) {
  if (!userId || !name) return

  // Prevent conflict
  const currentDeck = await deckExists(userId, name)
  if (currentDeck) return

  // Required
  const currentUser = await userExists(userId)
  if (!currentUser) return

  return db.setRecord(tableName, { userId, name })
}

module.exports = {
  getDecks,
  getDeck,
  deckExists,
  createDeck
}
