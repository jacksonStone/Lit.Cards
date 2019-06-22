const { CardBody } = require('../database')
const { Card } = require('../database')
const { Deck } = require('../database')
const sanitizeHTML = require('sanitize-html')
async function getCardBody (userId, deck, card) {
  return CardBody.getCardBody(userId, deck, card)
}
async function deleteCardBody (userId, deck, card) {
  //TODO:: Wrap this in a transaction or something
  await Deck.decrementCardCount(userId, deck)
  await Card.deleteCard(userId, deck, card)
  return CardBody.deleteCardBody(userId, deck, card)
}
async function deleteAllCardBodies (userId, deck) {
  return CardBody.deleteCardBodies(userId, deck)
}
function sanitizeCardContent (changes) {
  if (changes.front) {
    changes.front = sanitizeHTML(changes.front)
  }
  if (changes.back) {
    changes.back = sanitizeHTML(changes.back)
  }
}
async function editCardBody (userId, deck, card, changes) {
  sanitizeCardContent(changes)
  return CardBody.editCardBody(userId, deck, card, changes)
}
async function addCardBody (userId, deck, changes) {
  sanitizeCardContent(changes)
  delete changes.id
  //TODO:: Wrap this in a transaction or something
  await Deck.incrementCardCount(userId, deck)
  const card = await Card.createCard(userId, deck)
  await CardBody.addCardBody(userId, deck, card.id, changes)
  return card.id
}
module.exports = {
  getCardBody,
  editCardBody,
  addCardBody,
  deleteAllCardBodies,
  deleteCardBody,
  // For testing only
  sanitizeCardContent
}
