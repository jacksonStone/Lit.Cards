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
  let cardBodies = await CardBody.getCardBody(userEmail, deck, card)
  console.log("*******cardBodies");
  console.log(cardBodies);
  if (cardBodies && cardBodies.length) {
    cardBodies.forEach(cardBody => {
      delete cardBody.userEmail
    })
  }
  return cardBodies
}
async function deleteCardBody (userEmail, deck, card) {
  let cardBody = await getCardBody(userEmail, deck, card)
  if (cardBody && cardBody.length && cardBody[0].public) {
    return
  }
  await Deck.deleteCard(userEmail, deck, card)
  return CardBody.deleteCardBody(userEmail, deck, card)
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
  Deck.editDeck({ userEmail, id: deck }, { lastModified: Date.now() }).catch(() => {
    console.error('Failed to update deck lastModified')
  })
  return CardBody.editCardBody(userEmail, deck, card, changes)
}
async function upsertCardBody (userEmail, deck, changes = { front: '', back: '' }) {
  sanitizeCardContent(changes)
  const [existingCard, deckRecord] = await Promise.all([getCardBody(userEmail, deck, changes.id), Deck.getDeck(userEmail, deck)])
  if (existingCard.length) {
    let deckCards = deckRecord.cards
    if (deckRecord.cards.indexOf(changes.id) === -1) {
      // Somehow we got out of sync with deck cards and cardBodies that exist,
      // If we restarted in the middle for example - so handle this.
      deckCards += changes.id
      await Deck.editDeck(deckRecord, { cards: deckCards, lastModified: Date.now() })
    } else {
      Deck.editDeck({ userEmail, id: deck }, { lastModified: Date.now() }).catch(() => {
        console.error('Failed to update deck lastModified')
      })
    }
    return editCardBody(userEmail, deck, changes.id, changes)
  }
  const changeId = changes.id
  if (changeId && changeId.length === 1 && deckRecord.cards.indexOf(changeId) !== -1) {
    // This can happen if the server restarts inbetween a deck update and a card creation
    return CardBody.addCardBody(userEmail, deck, changes.id, changes)
  }
  delete changes.id
  let lastIdAsChar = deckRecord.cards ? deckRecord.cards[deckRecord.cards.length - 1] : intToChar(0)
  let nextIdAsInt = charToInt(lastIdAsChar) + 1
  let idAsChar = intToChar(nextIdAsInt)
  let cards = deckRecord.cards
  cards += idAsChar
  await Promise.all([
    CardBody.addCardBody(userEmail, deck, idAsChar, changes),
    Deck.editDeck(deckRecord, { cards })
  ])
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
