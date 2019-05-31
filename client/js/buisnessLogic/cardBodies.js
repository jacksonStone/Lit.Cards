const { getCardBody } = require('api/cardBodies')
const { getParam } = require('abstract/url')
const { jdecompress } = require('shared/compress')
const cachedCardBodies = {}
exports.getCardBody = async (card, deck) => {
  if (!card) {
    return
  }
  if (!deck) {
    deck = getParam('deck')
    if (!deck) {
      const dataDeck = window.lc.getData('deck')
      if (dataDeck && dataDeck.id) {
        deck = dataDeck.id
      }
    }
  }
  if (!cachedCardBodies[`${deck}:${card}`]) {
    try {
      let cardData = await getCardBody(deck, card)
      const cardDataAsJSON = JSON.parse(cardData)
      if (cardDataAsJSON && cardDataAsJSON.content) {
        const content = jdecompress(cardDataAsJSON.content)
        Object.assign(cardDataAsJSON, content)
        delete cardDataAsJSON.content
      }
      cachedCardBodies[`${deck}:${card}`] = cardDataAsJSON
    } catch (e) {
      debugger
      return
    }
  }
  return JSON.parse(JSON.stringify(cachedCardBodies[`${deck}:${card}`]))
}

exports.getCardBodyForEmptyState = (newId) => {
  const emptyValue = { id: newId, isNew: true, front: '', back: '' }
  // Record we made this on the fly
  window.lc.setData(`changes.cardBody.${newId}`, emptyValue)
  return emptyValue
}

exports.persistCardBodyChange = (cardBody, key, value) => {
  const changeCardBodyId = getCardBodyChangeId(cardBody)
  const changePath = `${changeCardBodyId}.${key}`
  window.lc.setPersistent(changePath, value)
}

exports.mergeCardBodyWithChanges = (cardBody) => {
  const changeCardBodyId = getCardBodyChangeId(cardBody)
  return Object.assign({}, cardBody, window.lc.getData(changeCardBodyId) || {})
}

function getCardBodyChangeId (cardBody) {
  return `changes.cardBody.${cardBody.id}`
}
