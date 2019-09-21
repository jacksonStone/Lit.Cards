let { getCardBody, editCardBody, addCardBody, deleteCardBody } = require('../routes/api/card-bodies')
let { getParam } = require('../browser-abstractions/url')
let { decompress } = require('shared/compress')
let cachedCardBodies = {}
function getDefaultDeck (deck) {
  if (!deck) {
    deck = getParam('deck')
    if (!deck) {
      let dataDeck = window.lc.getData('deck')
      if (dataDeck && dataDeck.id) {
        deck = dataDeck.id
      }
    }
  }
  return deck
}
exports.getCardBody = async (card, deck, visibleCards) => {
  if (!card) {
    return
  }
  let cardsToFetch = [card]
  if (visibleCards) {
    let indexOfCard = visibleCards.indexOf(card)
    let indexesToFetch = [
      (indexOfCard + 1) % visibleCards.length,
      (indexOfCard - 1) % visibleCards.length,
      (indexOfCard + 2) % visibleCards.length,
      (indexOfCard - 2) % visibleCards.length
    ]
    for (let i = 0; i < indexesToFetch.length; i++) {
      let index = indexesToFetch[i]
      if (visibleCards[index]) {
        cardsToFetch.push(visibleCards[index])
      }
    }
  }
  deck = getDefaultDeck(deck)
  let firstCardBody
  // don't wait on other fetches
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < cardsToFetch.length; i++) {
      let card = cardsToFetch[i]
      try {
        if (!cachedCardBodies[`${deck}:${card}`]) {
          let cardData = await getCardBody(deck, card)
          let cardDataAsJSON = JSON.parse(cardData)
          if (cardDataAsJSON) {
            cardDataAsJSON.front = cardDataAsJSON.front || ''
            cardDataAsJSON.back = cardDataAsJSON.back || ''

            // Decompress images
            if (cardDataAsJSON.frontHasImage) {
              cardDataAsJSON.frontImage = decompress(cardDataAsJSON.frontImage)
            }
            if (cardDataAsJSON.backHasImage) {
              cardDataAsJSON.backImage = decompress(cardDataAsJSON.backImage)
            }
          }
          cachedCardBodies[`${deck}:${card}`] = cardDataAsJSON
          if (!firstCardBody) {
            firstCardBody = cardDataAsJSON
            resolve(JSON.parse(JSON.stringify(firstCardBody)))
          }
        } else { // No cache
          if (!firstCardBody) {
            firstCardBody = cachedCardBodies[`${deck}:${card}`]
            resolve(JSON.parse(JSON.stringify(firstCardBody)))
          }
        }
      } catch (e) {
        return reject(e)
      }
    }
  })
}

exports.getCardBodyForEmptyState = (newId) => {
  let emptyValue = { id: newId, isNew: true, front: '', back: '' }
  // Record we made this on the fly
  window.lc.setPersistent(`cardBody.${newId}`, emptyValue)
  return emptyValue
}

exports.persistCardBodyChange = (cardBody, key, value) => {
  let changeCardBodyId = getCardBodyChangeId(cardBody)
  let changePath = `${changeCardBodyId}.${key}`
  window.lc.setPersistent(changePath, value)
}
function getCardBodyChangeId (cardBody) {
  return `cardBody.${cardBody.id}`
}
exports.editCardBody = (card, changes, deck) => {
  if (!card) {
    return
  }
  deck = getDefaultDeck(deck)
  return editCardBody(deck, card, changes)
}
exports.deleteCardBody = (card, deck) => {
  if (!card) {
    return
  }
  deck = getDefaultDeck(deck)
  return deleteCardBody(deck, card)
}
exports.addCardBody = async (changes, deck) => {
  deck = getDefaultDeck(deck)
  return addCardBody(deck, changes)
}
