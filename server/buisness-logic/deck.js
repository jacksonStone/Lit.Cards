let { Deck } = require('../database')
let { CardBody } = require('../database')
let { User } = require('../database')
let { deleteSessionByDeck } = require('./study')
let { deleteAllCardBodies } = require('./card-body')
let { removeFromStudyHistory } = require('./study-history')
let recordTransaction = require("../node-abstractions/record-transacting.js")
async function addDeck (userEmail, name) {
  const user = await User.getUser(userEmail)
  return recordTransaction(async () => {
    const newDeck = await Deck.createDeck(userEmail, name, user.displayName)
    await CardBody.addCardBody(userEmail, newDeck.id, newDeck.cards)
    return newDeck;
  });
}

async function deleteDeck (userEmail, id) {
  let deck = await Deck.getDeck(userEmail, id, true)
  // Do not allow deletion of public decks
  if (deck && deck.length && deck[0].public) {
    return
  }
  return recordTransaction(async () => {
    await removeFromStudyHistory(userEmail, id)
    await deleteSessionByDeck(userEmail, id)
    await deleteAllCardBodies(userEmail, id)
    return Deck.deleteDeck(userEmail, id)
  })
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
