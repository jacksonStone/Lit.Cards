let { CardBody } = require('../database')
// let { Card } = require('../database')
let { Deck } = require('../database')
let sanitizeHTML = require('sanitize-html')
let allowedTags = require('../../shared/allowedHTMLTags')
let { intToChar } = require('../../shared/char-encoding')
let sanitizeOptions = {
  allowedTags
}
async function getCardBody (userId, deck, card) {
  return CardBody.getCardBody(userId, deck, card)
}
async function deleteCardBody (userId, deck, card) {
  let cardBody = await getCardBody(userId, deck, card)
  if (cardBody && cardBody.length && cardBody[0].public) {
    return
  }
  // TODO:: Wrap this in a transaction or something
  await Deck.deleteCard(userId, deck, card)
  return CardBody.deleteCardBody(userId, deck, card)
}
async function deleteAllCardBodies (userId, deck) {
  return CardBody.deleteCardBodies(userId, deck)
}
function sanitizeCardContent (changes) {
  if (changes.front) {
    changes.front = sanitizeHTML(changes.front, sanitizeOptions)
  }
  if (changes.back) {
    changes.back = sanitizeHTML(changes.back, sanitizeOptions)
  }
}
async function editCardBody (userId, deck, card, changes) {
  sanitizeCardContent(changes)
  return CardBody.editCardBody(userId, deck, card, changes)
}
async function addCardBody (userId, deck, changes) {
  sanitizeCardContent(changes)
  delete changes.id
  // TODO:: Wrap this in a transaction or something
  let deckRecord = await Deck.getDeck(userId, deck)
  let nextId = deckRecord.nextId;
  let idAsChar = intToChar(nextId)

  await CardBody.addCardBody(userId, deck, idAsChar, changes)
  let cards = deckRecord.cards
  cards += idAsChar
  await Deck.editDeck(deckRecord, { cards, nextId: nextId + 1 })
  return idAsChar;
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
