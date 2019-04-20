const { CardBody } = require('../../database')

async function getCardBody (userId, deck, card) {
  return CardBody.getCardBody(userId, deck, card)
}

module.exports = {
  getCardBody
}
