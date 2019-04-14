const { Card } = require('../../database')

async function getCards (username, deck) {
  return Card.getCards(username, deck)
}

module.exports = {
  getCards
}
