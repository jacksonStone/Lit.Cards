const { Card } = require('../../database')

async function addCard (userId, deck, content) {
  return Card.createCard(userId, deck, content)
}

module.exports = {
  addCard
}
