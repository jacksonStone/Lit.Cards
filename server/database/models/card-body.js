let db = require('../external-connections/configured-connector')
let tableName = 'cardBody'
async function getCardBody (userEmail, deck, card) {
  let results
  if (card) {
    cardBody = await db.getRecord(tableName, { deck, id: card }, 1)
  } else {
    cardBody = await db.getRecord(tableName, { deck }, 1)
  }
  if(cardBody && (cardBody.userEmail === userEmail || cardBody.public)) {
    return cardBody;
  }
  return {}
}
async function getCardBodies (userEmail, deck) {
  return db.getRecord(tableName, { userEmail, deck })
}
async function addCardBody (userEmail, deck, card, changes) {
  return db.setRecord(tableName, Object.assign({ userEmail, deck, id: card }, changes))
}
async function editCardBody (userEmail, deck, card, changes) {
  // Account for images not being changes and text being changed
  return db.editRecord(tableName, { userEmail, deck, id: card }, changes)
}
async function deleteCardBody (userEmail, deck, card) {
  db.unsetRecord(tableName, { userEmail, deck, id: card })
}
async function editCardBodies(userEmail, deck, changes) {
  return db.editRecord(tableName, { userEmail, deck }, changes)
}
async function deleteCardBodies (userEmail, deck) {
  let results = await getCardBodies(userEmail, deck)
  if (results && results.length) {
    for (let res of results) {
      await db.unsetRecord(tableName, { id: res.id, deck, userEmail })
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
