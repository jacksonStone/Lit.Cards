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
// TODO::Correct to use deck ID
async function createCard (userId, deck) {
  const id = createId()
  return db.setRecord(tableName, { userId, deck, id })
}

module.exports = {
  getCards,
  deleteCards,
  createCard
}
