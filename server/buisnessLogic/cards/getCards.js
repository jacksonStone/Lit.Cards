const { Card } = require('../../database')

async function getCards (userId, deck) {
  return Card.getCards(userId, deck)
}

module.exports = {
  getCards
}
