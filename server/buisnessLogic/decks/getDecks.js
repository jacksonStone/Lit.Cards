const { Deck } = require('../../database')

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
  getDecks,
  getDeck
}
