const { getCardBody } = require('api/cardBodies')
const { getParam } = require('abstract/url')
const cachedCardBodies = {}
exports.getCardBody = async (deck, card) => {
  if (!deck) {
    deck = getParam('deck')
  }
  if (!cachedCardBodies[`${deck}:${card}`]) {
    cachedCardBodies[`${deck}:${card}`] = JSON.parse(await getCardBody(deck, card))
  }
  return JSON.parse(JSON.stringify(cachedCardBodies[`${deck}:${card}`]))
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

//
// exports.createCard = (deckName, body) => {
//   return createCard(deckName, body)
// }
