const db = require('../externalConnections/fakeData')
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
async function createCard (userId, deck, content) {
  if (!userId || !content) return
  const id = createId()
  //
  // // Required
  // const deckDoesExist = await deckExists(userId, deck)
  // if (!deckDoesExist) return

  return db.setRecord(tableName, { userId, deck, content, id })
}

module.exports = {
  getCards,
  deleteCards,
  createCard
}
