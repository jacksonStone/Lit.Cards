let { Deck } = require('../database')
let { CardBody } = require('../database')
let { deleteSessionByDeck } = require('./study')
let { deleteAllCardBodies } = require('./card-body')
let { removeFromStudyHistory } = require('./study-history')

async function addDeck (userId, name) {
  // make a transaction
  const newDeck = await Deck.createDeck(userId, name)
  await CardBody.addCardBody(userId, newDeck.id, newDeck.cards)
  return newDeck
}

async function deleteDeck (userId, id) {
  let deck = await Deck.getDeck(userId, id, true)
  // Do not allow deletion of public decks
  if (deck && deck.length && deck[0].public) {
    return
  }
  // make a transaction
  await removeFromStudyHistory(userId, id)
  await deleteSessionByDeck(userId, id)
  await deleteAllCardBodies(userId, id)
  return Deck.deleteDeck(userId, id)
}
async function renameDeck (userId, id, name) {
  return Deck.editDeck({ userId, id }, { name })
}
async function getDecks (userId) {
  let decks = await Deck.getDecks(userId)
  for (let deck of decks) {
    delete deck.userId
  }
  return decks
}
async function getDeck (userId, deckId) {
  return Deck.getDeck(userId, deckId)
}

async function makeDeckPublic (userId, deckId) {
  let deck = Deck.getDeck(userId, deckId, true)
  if (deck.none) {
    return
  }
  await Promise.all([
    Deck.editDeck({ userId, id: deckId }, { public: true }),
    CardBody.editCardBodies(userId, deckId, { public: true })
  ])
}

module.exports = {
  addDeck,
  getDecks,
  getDeck,
  makeDeckPublic,
  renameDeck,
  deleteDeck
}
