const { Deck } = require('../../database')

async function getDecks (username, deck) {
  return Deck.getDecks(username)
}

module.exports = {
  getDecks
}
