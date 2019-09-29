let db = require('../external-connections/fake-database-connector')
let tableName = 'deck'
let { userExists } = require('./user')
let { generateId } = require('../../../shared/id-generator')
let { intToChar } = require('../../../shared/char-encoding')
async function getDecks (userId) {
  let results = await db.getRecord(tableName, { userId })
  return results || []
}
async function getDeck (userId, deck, requireUserIdMatch = false) {
  let query = { id: deck };
  if(requireUserIdMatch) {
    query.userId = userId;
  }
  let results = await db.getRecord(tableName, query)
  if (results && results.length) {
    let firstResult = results[0];
    if (firstResult.userId === userId || firstResult.public) {
      if(firstResult.userId !== userId) {
        //We don't want to make emails public
        delete firstResult.userId;
      }
      return firstResult
    }
  }
  return { none: true }
}

async function editDeck ({ userId, id }, changes) {

  const recordsEdited = await db.editRecord(tableName, { userId, id }, changes)
  return recordsEdited
}
//TODO:: Consider making this an Or join
async function getByIdsWithCondition(ids, condition) {
  let resultingQueries = await Promise.all(ids.map(id => {
    return db.getRecord(tableName, {id, ...condition}, 1)
  }))
  let resultsWithValues = resultingQueries.filter(result => (result && result.length));
  //Flatten queries
  return resultsWithValues.map(result => {
    return result[0];
  })
}
async function deleteCard (userId, deck, card) {
  let deckRecord = await getDeck(userId, deck)
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
async function createDeck (userId, name, displayName) {
  if (!userId || !name || !displayName) return
  let id = generateId()
  let dateMade = Date.now()
  let cardCount = 1
  let cards = intToChar(0);
  return db.setRecord(tableName, { userId, displayName, name, id, date: dateMade, cardCount, cards })
}

async function deleteDeck (userId, id) {
  if (!userId || !id) return
  // Required
  let currentUser = await userExists(userId)
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
