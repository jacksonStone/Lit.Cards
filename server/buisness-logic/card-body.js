let { CardBody } = require('../database')
// let { Card } = require('../database')
let { Deck } = require('../database')
let sanitizeHTML = require('sanitize-html')
let allowedTags = require('../../shared/allowedHTMLTags')
let { intToChar, charToInt } = require('../../shared/char-encoding')
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
async function upsertCardBody (userId, deck, changes = {front: '', back: ''}) {
  sanitizeCardContent(changes)
  const existingCard = await getCardBody(userId, deck, changes.id)
  if (existingCard.length) {
    return editCardBody(userId, deck, changes.id, changes)
  }

  //Otherwise is truely new
  delete changes.id
  // TODO:: Wrap this in a transaction or something
  let deckRecord = await Deck.getDeck(userId, deck)
  let lastIdAsChar = deckRecord.cards ? deckRecord.cards[deckRecord.cards.length - 1] : intToChar(0);
  let nextIdAsInt = charToInt(lastIdAsChar) + 1;
  let idAsChar = intToChar(nextIdAsInt)
  await CardBody.addCardBody(userId, deck, idAsChar, changes)
  let cards = deckRecord.cards
  cards += idAsChar
  await Deck.editDeck(deckRecord, { cards })
  return idAsChar
}
module.exports = {
  getCardBody,
  editCardBody,
  upsertCardBody,
  deleteAllCardBodies,
  deleteCardBody,
  // For testing only
  sanitizeCardContent
}
