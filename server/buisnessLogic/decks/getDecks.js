const { Deck } = require('../../database')

async function getDecks (userId, deck) {
  return Deck.getDecks(userId)
}

module.exports = {
  getDecks
}
