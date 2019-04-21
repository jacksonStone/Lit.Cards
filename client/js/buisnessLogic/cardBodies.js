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
  return cachedCardBodies[`${deck}:${card}`]
}
//
// exports.createCard = (deckName, body) => {
//   return createCard(deckName, body)
// }
