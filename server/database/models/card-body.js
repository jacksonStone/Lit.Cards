const db = require('../external-connections/fake-database-connector')
const tableName = 'cardBody'

async function getCardBody (userId, deck, card) {
  let results
  if (card) {
    results = await db.getRecord(tableName, { userId, deck, id: card })
  } else {
    results = await db.getRecord(tableName, { userId, deck }, 1)
  }
  return results || {}
}
async function getCardBodies (userId, deck) {
  return db.getRecord(tableName, { userId, deck })
}
async function deleteCardBody (userId, deck, card) {
  db.unsetRecord(tableName, { userId, deck, id: card })
}
async function deleteCardBodies (userId, deck) {
  const results = await getCardBodies(userId, deck)
  if (results && results.length) {
    for (let res of results) {
      await db.unsetRecord(tableName, { id: res.id, deck, userId })
    }
  }
}

module.exports = {
  getCardBody,
  deleteCardBodies,
  deleteCardBody
}
