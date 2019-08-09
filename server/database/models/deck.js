const db = require('../external-connections/fake-database-connector')
const tableName = 'deck'
const { userExists } = require('./user')
const { generateId } = require('../../../shared/id-generator')
const { intToChar } = require('../../../shared/char-encoding')
async function getDecks (userId) {
  const results = await db.getRecord(tableName, { userId })
  return results || []
}
async function getDeck (userId, deck) {
  const results = await db.getRecord(tableName, { userId, id: deck })
  if (results && results.length) {
    return results[0]
  }
  return { none: true }
}
async function renameDeck (userId, deck, name) {
  return db.editRecord(tableName, { userId, id: deck }, { name })
}
async function editDeck ({ userId, id }, changes) {
  await db.editRecord(tableName, { userId, id }, changes)
}
async function deleteCard (userId, deck, card) {
  const deckRecord = await getDeck(userId, deck)
  if (!deckRecord) {
    return
  }
  let newCards = ''
  for(let i = 0; i < deckRecord.cards.length; i++) {
    if(deckRecord.cards[i] !== card) {
      newCards+=deckRecord.cards[i]
    }
  }
  await editDeck(deckRecord, { cards: newCards })
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
  deleteCard,
  renameDeck,
  editDeck,
  createDeck
}
