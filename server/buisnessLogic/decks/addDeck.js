const { Deck } = require('../../database')

async function addDeck (userId, name) {
  return Deck.createDeck(userId, name)
}

module.exports = {
  addDeck
}
