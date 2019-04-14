const db = require('../externalConnections/fakeData')
const { createId } = require('./utils')
const { deckExists } = require('./deck')
const tableName = 'card'

async function getCards (userId, deck) {
  console.log('Getting cards: ', userId, deck)
  const results = await db.getRecord(tableName, { userId, deck })
  console.log(results)
  return results || []
}

async function createCard (userId, deck, content) {
  if (!userId || !content) return
  const id = createId()

  // Required
  const deckDoesExist = await deckExists(userId, deck)
  if (!deckDoesExist) return
  console.log('Deck does exist')

  return db.setRecord(tableName, { userId, deck, content, id })
}

module.exports = {
  getCards,
  createCard
}
