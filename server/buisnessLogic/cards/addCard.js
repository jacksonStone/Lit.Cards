const { Card } = require('../../database')

async function addCard (username, deck, content) {
  console.log(arguments)
  return Card.createCard(username, deck, content)
}

module.exports = {
  addCard
}
