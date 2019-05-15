const { getCardBody } = require('api/cardBodies')
const { getParam } = require('abstract/url')
const cachedCardBodies = {}
exports.getCardBody = async (deck, card) => {
  if (!deck) {
    deck = getParam('deck')
  }
  if (!cachedCardBodies[`${deck}:${card}`]) {
    const cardData = await getCardBody(deck, card)
    try {
      cachedCardBodies[`${deck}:${card}`] = JSON.parse(cardData)
    } catch (e) {
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
