const { Deck } = require('../database')
const { deleteSessionByDeck } = require('./study')
const { deleteAllCardsFromDeck } = require('./card')
const { deleteAllCardBodies } = require('./cardBody')

async function addDeck (userId, name) {
  return Deck.createDeck(userId, name)
}

async function deleteDeck (userId, id) {
  await deleteSessionByDeck(userId, id)
  await deleteAllCardBodies(userId, id)
  await deleteAllCardsFromDeck(userId, id)
  return Deck.deleteDeck(userId, id)
}
async function renameDeck (userId, id, name) {
  return Deck.renameDeck(userId, id, name)
}

async function getDecks (userId) {
  const decks = await Deck.getDecks(userId)
  for (let deck of decks) {
    delete deck.userId
  }
  return decks
}
// TODO Repurpose to allow public  decks without user
async function getDeck (userId, deckId) {
  return Deck.getDeck(userId, deckId)
}

module.exports = {
  addDeck,
  getDecks,
  getDeck,
  renameDeck,
  deleteDeck
}
