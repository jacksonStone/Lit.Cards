const { Card } = require('../../database')

async function addCard (userId, deck, content) {
  console.log(arguments)
  return Card.createCard(userId, deck, content)
}

module.exports = {
  addCard
}
