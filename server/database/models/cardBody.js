const db = require('../externalConnections/fakeData')
const tableName = 'cardBody'

async function getCardBody (userId, deck, card) {
  let results
  if (card) {
    results = await db.getRecord(tableName, { userId, deck, id: card })
  } else {
    results = await db.getRecord(tableName, { userId, deck }, 1)
  }
  console.log(results)
  return results || {}
}

module.exports = {
  getCardBody
}
