const { Deck } = require('../../database')

async function getDecks (userId) {
  const decks = await Deck.getDecks(userId)
  for (let deck of decks) {
    delete deck.userId
  }
  return decks
}

module.exports = {
  getDecks
}
