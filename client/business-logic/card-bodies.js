const { getCardBody, editCardBody } = require('../routes/api/card-bodies')
const { getParam } = require('../browser-abstractions/url')
const { decompress, compress } = require('shared/compress')
const cachedCardBodies = {}
function getDefaultDeck(deck) {
  if (!deck) {
    deck = getParam('deck')
    if (!deck) {
      const dataDeck = window.lc.getData('deck')
      if (dataDeck && dataDeck.id) {
        deck = dataDeck.id
      }
    }
  }
  return deck
}

exports.getCardBody = async (card, deck) => {
  if (!card) {
    return
  }
  deck = getDefaultDeck(deck)
  if (!cachedCardBodies[`${deck}:${card}`]) {
    try {
      let cardData = await getCardBody(deck, card)
      const cardDataAsJSON = JSON.parse(cardData)
      if(cardDataAsJSON) {
        // Decompress images
        if(cardDataAsJSON.frontHasImage) {
          cardDataAsJSON.frontImage = decompress(cardDataAsJSON.frontImage)
        }
        if(cardDataAsJSON.backHasImage) {
          cardDataAsJSON.backImage = decompress(cardDataAsJSON.backImage)
        }
      }
      cachedCardBodies[`${deck}:${card}`] = cardDataAsJSON
    } catch (e) {
      return
    }
  }
  return JSON.parse(JSON.stringify(cachedCardBodies[`${deck}:${card}`]))
}
exports.getCardBodyForEmptyState = (newId) => {
  const emptyValue = { id: newId, isNew: true, front: '', back: '' }
  // Record we made this on the fly
  window.lc.setPersistent(`cardBody.${newId}`, emptyValue)
  return emptyValue
}

exports.persistCardBodyChange = (cardBody, key, value) => {
  const changeCardBodyId = getCardBodyChangeId(cardBody)
  const changePath = `${changeCardBodyId}.${key}`
  window.lc.setPersistent(changePath, value)
}
function getCardBodyChangeId(cardBody) {
  return `cardBody.${cardBody.id}`
}
exports.editCardBody = (card, changes, deck) => {
  if (!card) {
    return
  }
  deck = getDefaultDeck(deck)
  return editCardBody(deck, card, changes)
}
