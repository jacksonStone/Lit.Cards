const db = require('../externalConnections/fakeData')
const { createId } = require('./utils')
const { deckExists } = require('./deck')
const tableName = 'card'

async function getCards (username, deck) {
  console.log('Getting cards: ', username, deck)
  const results = await db.getRecord(tableName, { username, deck })
  console.log(results)
  return results || []
}

async function createCard (username, deck, content) {
  if (!username || !content) return
  const id = createId()

  // Required
  const deckDoesExist = await deckExists(username, deck)
  if (!deckDoesExist) return
  console.log('Deck does exist')

  return db.setRecord(tableName, { username, deck, content, id })
}

module.exports = {
  getCards,
  createCard
}
