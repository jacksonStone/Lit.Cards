const db = require('../external-connections/fake-database-connector')
const { createId } = require('./utils')
const tableName = 'card'

async function getCards (userId, deck) {
  const results = await db.getRecord(tableName, { userId, deck })
  return results || []
}
async function deleteCards (userId, deck) {
  const results = await getCards(userId, deck)
  if (results && results.length) {
    for (let res of results) {
      await db.unsetRecord(tableName, res)
    }
  }
}
async function deleteCard (userId, deck, card) {
  await db.unsetRecord(tableName, {deck, id: card, userId})
}
async function createCard (userId, deck) {
  const id = createId()
  return db.setRecord(tableName, { userId, deck, id })
}

module.exports = {
  getCards,
  deleteCards,
  deleteCard,
  createCard
}
