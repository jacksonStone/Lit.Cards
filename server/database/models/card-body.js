let db = require('../external-connections/fake-database-connector')
let tableName = 'cardBody'

async function getCardBody (userId, deck, card) {
  let results
  if (card) {
    results = await db.getRecord(tableName, { deck, id: card })
  } else {
    results = await db.getRecord(tableName, { deck }, 1)
  }
  results = (results && results.length) ? results.filter(cardBody => {
    return ( cardBody.userId === userId || cardBody.public );
  }) : results
  return results || {}
}
async function getCardBodies (userId, deck) {
  return db.getRecord(tableName, { userId, deck })
}
async function addCardBody (userId, deck, card, changes) {
  return db.setRecord(tableName, Object.assign({ userId, deck, id: card }, changes))
}
async function editCardBody (userId, deck, card, changes) {
  // Account for images not being changes and text being changed
  return db.editRecord(tableName, { userId, deck, id: card }, changes)
}
async function deleteCardBody (userId, deck, card) {
  db.unsetRecord(tableName, { userId, deck, id: card })
}
async function editCardBodies(userId, deck, changes) {
  return db.editRecord(tableName, { userId, deck }, changes)
}
async function deleteCardBodies (userId, deck) {
  let results = await getCardBodies(userId, deck)
  if (results && results.length) {
    for (let res of results) {
      await db.unsetRecord(tableName, { id: res.id, deck, userId })
    }
  }
}

module.exports = {
  editCardBody,
  editCardBodies,
  addCardBody,
  getCardBody,
  deleteCardBodies,
  deleteCardBody
}
