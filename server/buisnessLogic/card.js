const { Card } = require('../database')

async function addCard (userId, deck, content) {
  return Card.createCard(userId, deck, content)
}

async function getCards (userId, deck) {
  return Card.getCards(userId, deck)
}
async function deleteAllCardsFromDeck (userId, deck) {
  await Card.deleteCards(userId, deck)
}

module.exports = {
  addCard,
  deleteAllCardsFromDeck,
  getCards
}
