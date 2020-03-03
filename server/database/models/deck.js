let db = require('../external-connections/configured-connector')
let tableName = 'deck.ts.ts'
let { userExists } = require('./user')
let { generateId } = require('../../../shared/id-generator')
let { intToChar } = require('../../../shared/char-encoding')
async function getDecks (userEmail) {
  let results = await db.getRecord(tableName, { userEmail })
  return results || []
}
async function getDeck (userEmail, deck, requireUserIdMatch = false) {
  let query = { id: deck };
  if(requireUserIdMatch) {
    query.userEmail = userEmail;
  }
  let results = await db.getRecord(tableName, query, 1)
  if (results) {
    let firstResult = results;
    if (firstResult.userEmail === userEmail || firstResult.public) {
      if(firstResult.userEmail !== userEmail) {
        //We don't want to make emails public
        delete firstResult.userEmail;
      }
      return firstResult
    }
  }
  return { none: true }
}

async function editDeck ({ userEmail, id }, changes) {

  const recordsEdited = await db.editRecord(tableName, { userEmail, id }, changes)
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
async function deleteCard (userEmail, deck, card) {
  let deckRecord = await getDeck(userEmail, deck)
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
async function createDeck (userEmail, name, displayName) {
  if (!userEmail || !name || !displayName) return
  let id = generateId()
  let dateMade = Date.now()
  let cards = intToChar(0);
  return db.setRecord(tableName, { userEmail, displayName, name, id, date: dateMade, cards })
}

async function deleteDeck (userEmail, id) {
  if (!userEmail || !id) return
  // Required
  let currentUser = await userExists(userEmail)
  if (!currentUser) return
  return db.unsetRecord(tableName, { userEmail, id })
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
