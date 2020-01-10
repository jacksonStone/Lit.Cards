let { CardBody } = require('../database')
// let { Card } = require('../database')
let { Deck } = require('../database')
let sanitizeHTML = require('sanitize-html')
let allowedTags = require('../../shared/allowedHTMLTags')
let { intToChar, charToInt } = require('../../shared/char-encoding')
let sanitizeOptions = {
  allowedTags
}

async function getCardBody (userEmail, deck, card) {
  let cardBodies = CardBody.getCardBody(userEmail, deck, card)
  if (cardBodies && cardBodies.length) {
    cardBodies.forEach(cardBody => {
      delete cardBody.userEmail
    })
  }
  return cardBodies
}
let recordTransaction = require('../node-abstractions/record-transacting');
async function deleteCardBody (userEmail, deck, card) {
  let cardBody = await getCardBody(userEmail, deck, card)
  if (cardBody && cardBody.length && cardBody[0].public) {
    return
  }
  return recordTransaction(async () => {
    await Deck.deleteCard(userEmail, deck, card)
    return CardBody.deleteCardBody(userEmail, deck, card)
  });
}
async function deleteAllCardBodies (userEmail, deck) {
  return CardBody.deleteCardBodies(userEmail, deck)
}
function sanitizeCardContent (changes) {
  if (changes.front) {
    changes.front = sanitizeHTML(changes.front, sanitizeOptions)
  }
  if (changes.back) {
    changes.back = sanitizeHTML(changes.back, sanitizeOptions)
  }
}
let protectedDeckFields = [
  'public',
  'deck',
  'id',
  'userEmail'
]
async function editCardBody (userEmail, deck, card, changes) {
  for (let i = 0; i < protectedDeckFields.length; i++) {
    delete changes[protectedDeckFields[i]]
  }
  sanitizeCardContent(changes)
  return CardBody.editCardBody(userEmail, deck, card, changes)
}
async function upsertCardBody (userEmail, deck, changes = { front: '', back: '' }) {
  sanitizeCardContent(changes)
  const existingCard = await getCardBody(userEmail, deck, changes.id)
  if (existingCard.length) {
    return editCardBody(userEmail, deck, changes.id, changes)
  }

  // Otherwise is truely new
  delete changes.id
  let deckRecord = await Deck.getDeck(userEmail, deck)
  let lastIdAsChar = deckRecord.cards ? deckRecord.cards[deckRecord.cards.length - 1] : intToChar(0)
  let nextIdAsInt = charToInt(lastIdAsChar) + 1
  let idAsChar = intToChar(nextIdAsInt)
  await recordTransaction(async () => {
    await CardBody.addCardBody(userEmail, deck, idAsChar, changes)
    let cards = deckRecord.cards
    cards += idAsChar
    await Deck.editDeck(deckRecord, { cards })
  })
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
