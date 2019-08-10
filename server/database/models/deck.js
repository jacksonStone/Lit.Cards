const db = require('../external-connections/fake-database-connector')
const tableName = 'deck'
const { userExists } = require('./user')
const { generateId } = require('../../../shared/id-generator')
const { intToChar } = require('../../../shared/char-encoding')
async function getDecks (userId) {
  const results = await db.getRecord(tableName, { userId })
  return results || []
}
async function getDeck (userId, deck, requireUserIdMatch = false) {
  const query = { id: deck };
  if(requireUserIdMatch) {
    query.userId = userId;
  }
  const results = await db.getRecord(tableName, query)
  if (results && results.length) {
    const firstResult = results[0];
    if (firstResult.userId === userId || firstResult.public) {
      return firstResult
    }
  }
  return { none: true }
}

async function editDeck ({ userId, id }, changes) {
  await db.editRecord(tableName, { userId, id }, changes)
}
//TODO:: Consider making this an Or join
async function getByIdsWithCondition(ids, condition) {
  const resultingQueries = await Promise.all(ids.map(id => {
    return db.getRecord(tableName, {id, ...condition}, 1)
  }))
  const resultsWithValues = resultingQueries.filter(result => (result && result.length));
  //Flatten queries
  return resultsWithValues.map(result => {
    return result[0];
  })
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
  editDeck,
  getByIdsWithCondition,
  createDeck
}
