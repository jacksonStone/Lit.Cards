const { Deck } = require('../../database')

async function addDeck (username, name) {
  return Deck.createDeck(username, name)
}

module.exports = {
  addDeck
}
