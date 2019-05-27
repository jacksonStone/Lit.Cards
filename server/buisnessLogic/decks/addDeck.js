const { Deck } = require('../../database')

async function addDeck (userId, name) {
  return Deck.createDeck(userId, name)
}

async function deleteDeck (userId, id) {
  return Deck.deleteDeck(userId, id)
}
module.exports = {
  addDeck,
  deleteDeck
}
