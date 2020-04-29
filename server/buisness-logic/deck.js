let { Deck } = require('../database')
let { CardBody } = require('../database')
let { User } = require('../database')
let { deleteSessionByDeck } = require('./study')
let { deleteAllCardBodies } = require('./card-body')
let { removeFromStudyHistory } = require('./study-history')
async function addDeck (userEmail, name) {
  const user = await User.getUser(userEmail)
  const newDeck = await Deck.createDeck(userEmail, name, user && user.displayName)
  await CardBody.addCardBody(userEmail, newDeck.id, newDeck.cards)
  return newDeck
}

async function deleteDeck (userEmail, id) {
  let deck = await Deck.getDeck(userEmail, id, true)
  // Do not allow deletion of public decks
  if (deck && deck.length && deck[0].public) {
    return
  }
  await removeFromStudyHistory(userEmail, id)
  await deleteSessionByDeck(userEmail, id)
  await Deck.deleteDeck(userEmail, id)
  await deleteAllCardBodies(userEmail, id)
}
async function renameDeck (userEmail, id, name) {
  return Deck.editDeck({ userEmail, id }, { name })
}
async function getDecks (userEmail) {
  let decks = await Deck.getDecks(userEmail)
  for (let deck of decks) {
    delete deck.userEmail
  }
  return decks
}
async function getDeck (userEmail, deckId) {
  return Deck.getDeck(userEmail, deckId)
}

async function makeDeckPublic (userEmail, deckId) {
  let deck = Deck.getDeck(userEmail, deckId, true)
  if (deck.none) {
    return
  }
  await Promise.all([
    Deck.editDeck({ userEmail, id: deckId }, { public: true }),
    CardBody.editCardBodies(userEmail, deckId, { public: true })
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
