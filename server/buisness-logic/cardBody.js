const { CardBody } = require('../database')

async function getCardBody (userId, deck, card) {
  return CardBody.getCardBody(userId, deck, card)
}
// TODO:: Fire this when deleting a card
async function deleteCardBody (userId, deck, card) {
  return CardBody.deleteCardBody(userId, deck, card)
}
// TODO:: Add ability to delete cardbodies in response to deck or card deletion
async function deleteAllCardBodies (userId, deck) {
  return CardBody.deleteCardBodies(userId, deck)
}
async function editCardBody (userId, deck, card, changes) {
  return CardBody.editCardBody(userId, deck, card, changes)
}

module.exports = {
  getCardBody,
  editCardBody,
  deleteAllCardBodies,
  deleteCardBody
}
