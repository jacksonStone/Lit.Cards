const db = require('../externalConnections/fakeData')
const tableName = 'deck'
const { userExists } = require('./user')
const { generateId } = require('../../../shared/id-generator')
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
  // Required
  const currentUser = await userExists(userId)
  if (!currentUser) return
  const id = generateId()
  const dateMade = Date.now()
  const cardCount = 0
  return db.setRecord(tableName, { userId, name, id, date: dateMade, cardCount })
}

async function deleteDeck (userId, id) {
  if (!userId || !id) return
  // Required
  const currentUser = await userExists(userId)
  if (!currentUser) return
  return db.unsetRecord(tableName, { userId, id })
}

module.exports = {
  getDecks,
  getDeck,
  deleteDeck,
  deckExists,
  createDeck
}
